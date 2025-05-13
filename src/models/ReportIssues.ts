import errorStackParser from 'error-stack-parser'
import { wait } from 'mybase/ts'
import util from 'util'
import debugLib from 'debug'
import path from 'path'
import fs from 'fs'
import CRC32 from 'crc-32'
import os from 'os'
// Ensure tsconfig.json has "resolveJsonModule": true
import pkg from '../../package.json'
import { MYIOClient } from '@7c/myioframework'

// -----------------------------------------------------------------------------
// Type declarations
// -----------------------------------------------------------------------------

type LogLevel = 'fatal' | 'warning' | 'debug' | 'info' | 'error'

export interface ReportOptions {
  live?: boolean
  folder?: string
  server?: string
  server_path?: string
  minimumInterval?: number
  output?: boolean
}

export interface IssueOptions {
  expireAfter?: number // in minutes, issue will auto expire after this minutes
  minSeenCount?: number // minimum number of times the issue has been seen before it is reported
  hostname?: string // hostname to overwrite inside the meta.hostname with this
}

interface ExtraData {
  [key: string]: unknown
}

export interface ReportContent {
  v: number
  issue_id: number
  meta: Record<string, unknown>
  options: Record<string, unknown>
  caller: string
  stackTrace: string[] | false
  app: string
  extra: ExtraData
  description: string
  level: LogLevel
  libversion: string
  t: number
}

// -----------------------------------------------------------------------------
// Constants & Helpers
// -----------------------------------------------------------------------------

const defaultReportOptions: Required<ReportOptions> = {
  live: false,
  folder: '/var/coadmin',
  server: 'https://127.0.0.1:3000/api',
  server_path: '/socket.io',
  minimumInterval: 60 * 1000,
  output: false,
}

const reports: Record<number, number> = {}

function isError(e: unknown): e is Error {
  return util.types.isNativeError(e)
}

const debug = debugLib('_ReportIssues')
debug.enabled = debug.enabled || typeof jest !== 'undefined'

// -----------------------------------------------------------------------------
// Main class
// -----------------------------------------------------------------------------

export default class ReportIssues {
  private socket: MYIOClient | null = null
  private buffer: ReportContent[] = []
  private reported: Record<string, unknown> = {}
  private meta: Record<string, unknown>
  private reportOptions: Required<ReportOptions>
  private appName: string

  constructor(appName: string, 
    options: ReportOptions = defaultReportOptions) {
    this.appName = appName.toLowerCase().trim()
    this.reportOptions = { ...defaultReportOptions, ...options }
    this.meta = {
      hostname: os.hostname(),
    }
    debug(this.meta)

    if (this.reportOptions.live) {
      this.socket = new MYIOClient(
        { url: this.reportOptions.server, name: 'coadmin-lib', output: this.reportOptions.output },
        { path: this.reportOptions.server_path },
      )
      this.socket.connect()
      void this.liveWorker()
    }
  }

  // ---------------------------------------------------------------------------
  // Public helpers (severity wrappers)
  // ---------------------------------------------------------------------------

  fatal(issue: unknown, extra: ExtraData = {}, opts: IssueOptions = {}) {
    return this.add(issue, extra, 'fatal', opts)
  }
  warning(issue: unknown, extra: ExtraData = {}, opts: IssueOptions = {}) {
    return this.add(issue, extra, 'warning', opts)
  }
  debug(issue: unknown, extra: ExtraData = {}, opts: IssueOptions = {}) {
    return this.add(issue, extra, 'debug', opts)
  }
  info(issue: unknown, extra: ExtraData = {}, opts: IssueOptions = {}) {
    return this.add(issue, extra, 'info', opts)
  }
  error(issue: unknown, extra: ExtraData = {}, opts: IssueOptions = {}) {
    return this.add(issue, extra, 'error', opts)
  }

  // ---------------------------------------------------------------------------
  // Core logic
  // ---------------------------------------------------------------------------

  private async liveWorker(): Promise<void> {
    if (!this.reportOptions.live || !this.socket) return
    debug('liveWorker has been started')

    while (true) {
      try {
        // @ts-ignore
        if (this.socket?.isConnected) {
          const payload = this.buffer.shift()
          if (payload) {
            debug(
              `submitting payload | app: ${payload.app} | level: ${payload.level} | issue_id: ${payload.issue_id} | description: ${payload.description}`,
            )
            this.socket.emit('issues.submit', payload)
          }
        }
      } catch (err) {
        console.error('coadmin-lib:ReportIssues:liveWorker error', err)
        await wait(1)
      }
      await wait(0.1)
    }
  }

  stackTrace(lines: number = 10): string[] {
    const oldStackTrace = Error.prepareStackTrace
    const BASE_DIR_NAME = process.cwd()

    const boilerplateLines = (line: NodeJS.CallSite): boolean =>
      !!(
        line &&
        line.getFileName() &&
        line.getFileName()!.indexOf('<My Module Name>') &&
        line.getFileName()!.indexOf('/node_modules/') < 0
      )

    try {
      Error.prepareStackTrace = (_err, structured) => structured
      Error.captureStackTrace(this)
      // @ts-ignore – we know stack is now CallSite[]
      const callSites: NodeJS.CallSite[] = (this as unknown as { stack: NodeJS.CallSite[] }).stack.filter(
        boilerplateLines,
      )
      if (callSites.length === 0) return []

      return callSites.slice(0, lines).map((cs) => {
        let fileName = cs.getFileName() || ''
        fileName = fileName.includes(BASE_DIR_NAME)
          ? fileName.substring(BASE_DIR_NAME.length + 1)
          : fileName
        return `${fileName}:${cs.getLineNumber()}`
      })
    } catch {
      return []
    } finally {
      Error.prepareStackTrace = oldStackTrace
    }
  }

  private generateIssue(
    issue: unknown,
    extra: ExtraData,
    level: LogLevel = 'info',
    issueOptions: IssueOptions = {},
  ): ReportContent | false {
    try {
      debug('#generate', issue, extra, level, issueOptions)
      let st = this.stackTrace(10)
      const st0 = st

      if (isError(issue)) {
        let frames = errorStackParser.parse(issue)
        frames = frames.filter((f) => !f.fileName?.includes('node:internal/'))
        st = frames.map((f) => `${f.fileName}:${f.functionName}:${f.lineNumber}`)

        extra = {
          ...extra,
          errno: (issue as NodeJS.ErrnoException).errno ?? false,
        }
        issue = issue.message
      }

      if (st0.length) extra.st0 = st0

      const hash = Math.abs(CRC32.str(`${this.appName}_issue_${level}_${String(issue)}`.toLowerCase()))
      if (reports[hash] && Date.now() < reports[hash]) return false
      reports[hash] = Date.now() + this.reportOptions.minimumInterval

      return {
        v: 5,
        issue_id: hash,
        meta: this.meta,
        options: issueOptions as any,
        caller: st0[0] ?? '-',
        stackTrace: st.length ? st : false,
        app: this.appName,
        extra,
        description: String(issue),
        level,
        libversion: (pkg as { version?: string }).version ?? 'unknown',
        t: Date.now(),
      }
    } catch (err) {
      console.error(err)
      return false
    }
  }

  private add(
    issue: unknown,
    extra: ExtraData,
    level: LogLevel = 'info',
    issueOptions: IssueOptions = {},
  ): boolean {
    try {
      debug('#add')
      const issueGenerated = this.generateIssue(issue, extra, level, issueOptions)
      if (!issueGenerated) return false

      if (this.reportOptions.live) {
        this.buffer.push(issueGenerated)
        debug(`#add:++buffer ${this.buffer.length}`)
      } else {
        const fileName = `${issueGenerated.issue_id}.coadmin_issue`
        const fullPath = path.join(this.reportOptions.folder, fileName)
        debug('#add:file', fullPath)
        fs.writeFileSync(fullPath, JSON.stringify(issueGenerated))
        debug('#add:success', fullPath)
      }
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }
}

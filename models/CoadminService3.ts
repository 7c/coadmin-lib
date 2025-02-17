import debug from 'debug'
import path from 'path'
import fs from 'fs'
import * as CRC32 from 'crc-32'
import { Timespan,Unixtime } from 'mybase/ts'


export interface CoadminServiceOptions {
  folder: string
  ping: boolean
  reportInterval: Timespan
  serviceDescription?: string
  debug?: boolean
}

export interface CoadminMeta {
  dir: string
  filename: string
}

// default options
const defaultOptions: CoadminServiceOptions = {
  folder: '/var/coadmin',
  ping: true,
  reportInterval: Timespan.minutes(1),
  debug: false
}

export class CoadminService3 {
  log: debug.Debugger
  reported: { [operation: string]: Unixtime } = {}
  meta: CoadminMeta = {
    dir: __dirname,
    filename: require?.main?.filename || process.argv?.[1] || 'unknown'
  }
  options: Required<CoadminServiceOptions>

  constructor(readonly serviceName: string, options: Partial<CoadminServiceOptions> = defaultOptions) {
    this.log = debug(`${this.serviceName}`)
    this.options = { ...defaultOptions, ...options } as Required<CoadminServiceOptions>
    this.log.enabled = options.debug ?? false
    if (!options.serviceDescription) 
      this.options.serviceDescription = this.serviceName
    
    this.log('constructor', this.serviceName, this.options)
    // auto pinger every minute
    if (this.options.ping) {
      this.log('enabling pinger for', this.serviceName)
      this.reportSuccess('ping') // first ping
      setInterval(() => { this.reportSuccess('ping') }, this.options.reportInterval.miliseconds)
    }
  }

  reportSuccess(operation: string, params: any={}): string | Error | boolean {    
    return this.report(operation, params)
  }


  
  isReady(): boolean {
    // log('isReady', this.options?.folder, fs.existsSync(this.options.folder))
    return !!(this.options?.folder && fs.existsSync(this.options.folder))
  }

  reportError(operation: string, params: any={}): string | Error | boolean {
    return this.report(operation, params, true)
  }

  calculateServiceFilename(operation: string): string {
    const file_name = Math.abs(CRC32.str(`${this.serviceName}_${operation}`)) + '.coadmin_service'
    this.log('calculateServiceFilename', file_name)
    return path.join(this.options.folder || defaultOptions.folder, file_name)
  }

  private report(operation: string, params?: any, is_error: boolean = false): string | Error | boolean {
    if (!this.isReady()) return false
    if (!this.reported.hasOwnProperty(operation)) this.reported[operation] = Unixtime.now().addYears(-10)

    if (this.reported[operation].elapsed.seconds < this.options.reportInterval.seconds) {
      // report is too frequent
      return false
    }

    this.reported[operation] = Unixtime.now()

    const file_content = {
      v: 3,
      meta: this.meta,
      service: this.serviceName,
      operation,
      params,
      error: is_error,
      t: Date.now()
    }
    
    const full_filename = this.calculateServiceFilename(operation)
    
    try {
      fs.writeFileSync(full_filename, JSON.stringify(file_content))
      this.log(`report:success ${operation} ${full_filename}`)
      return full_filename
    } catch (err) {
      this.log(`report:error ${operation} ${full_filename}`, err)
      return err as Error
    }
  }
}

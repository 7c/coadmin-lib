import path from 'path'
import fs from 'fs'
import * as CRC32 from 'crc-32'
import { Timespan,Unixtime } from 'mybase/ts'

export interface CoadminServiceOptions {
  folder: string
  ping: boolean
  reportInterval: Timespan
  serviceDescription?: string
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
}

export class CoadminService3 {
  reported: { [operation: string]: Unixtime } = {}
  meta: CoadminMeta = {
    dir: __dirname,
    filename: require?.main?.filename || process.argv?.[1] || 'unknown'
  }
  options: Required<CoadminServiceOptions>

  constructor(readonly serviceName: string, options: Partial<CoadminServiceOptions> = defaultOptions) {
    this.options = { ...defaultOptions, ...options } as Required<CoadminServiceOptions>
    if (!options.serviceDescription) 
      this.options.serviceDescription = this.serviceName
    
    // auto pinger every minute
    if (this.options.ping) {
      this.reportSuccess('ping') // first ping
      setInterval(() => { this.reportSuccess('ping') }, 1000)
    }
  }

  reportSuccess(operation: string, params: any={}): void {
    this.report(operation, params)
  }


  
  isReady(): boolean {
    return !!(this.options?.folder && fs.existsSync(this.options.folder))
  }

  reportError(operation: string, params: any={}): void {
    this.report(operation, params, true)
  }

  calculateServiceFilename(operation: string): string {
    const file_name = Math.abs(CRC32.str(`${this.serviceName}_${operation}`)) + '.coadmin_service'
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
      return full_filename
    } catch (err) {
      return err as Error
    }
  }
}

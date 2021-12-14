/*
    A small class to help sending coadmin service reports
    creates a file in coadmins folder, so coadmin can send it to the server
*/

const path = require('path')
const fs = require('fs')
const CRC32 = require('crc-32')

let defaultOptions = {
    folder:'/var/coadmin',
    ping:true
}

class CoadminService {
    constructor(serviceName,options=defaultOptions) {
      this.serviceName = serviceName
      this.options=options
      this.reported = {}
      this.meta = {
        dir:__dirname,
        filename:process.mainModule.filename,
      }

      // auto pinger every minute
      if (options.hasOwnProperty('ping') && options['ping']===true) {
          this.report_every(1,'ping',false,false)
          setInterval(()=>{ this.report_every(1,'ping',false,false)},1000)
      }
    }
    
    report_every(minute,operation,params,output=false) {
        if (!this.reported.hasOwnProperty(operation)) this.reported[operation]=0
        let last_report_ago = Date.now() - this.reported[operation]
        if (last_report_ago>minute*60*1000) {
            this.report(operation,params,output)
            this.reported[operation]=Date.now()
        }        
    }
    report_error(operation,params,output=false) {
        this.report(operation,params,output,true)
    }

    report(operation,params,output=false,error=false) {
        let file_content = {
            v:1,
            meta:this.meta,
            service:this.serviceName,
            operation:operation,
            params,
            error,
            t:Date.now()
        }
        let file_name = Math.abs(CRC32.str(`${this.serviceName}_${operation}`))+'.coadmin_service'
        let full_filename = path.join(this.options.folder,file_name)
        if (fs.existsSync(this.options.folder)) {
            try {
                if (output) console.log(`[COADMIN:${this.serviceName}] ${operation} ${params?params:''}`,this.meta)
                fs.writeFileSync(full_filename,JSON.stringify(file_content))
                return full_filename
            }catch(err) {
                return err
            }
        } else {
            if (output) console.log(`ERROR: FOLDER DOES NOT EXIST, [COADMIN:${this.serviceName}] ${operation} ${params?params:''}`,this.meta)
            return false
        }
    }
}



module.exports = CoadminService
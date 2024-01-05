/*
  is being developed, subject to change
*/

const path = require('path')
const fs = require('fs')
const CRC32 = require('crc-32')
const os = require('os')

let defaultOptions = {
    folder: '/var/coadmin',
    minimumInterval: 60 * 1000
}

const reports = {}

class ReportIssues {
    constructor(appName, options = defaultOptions) {
        this.appName = appName.toLowerCase()
        this.options = Object.assign(defaultOptions, options)
        this.reported = {}
        this.meta = {
            // dir: __dirname,
            hostname: os.hostname(),
            // filename: require?.main?.filename || process.argv?.[1] || 'unknown'
        }
    }

    #stackTraceInfo() {
        try {
            const err = new Error();
            Error.captureStackTrace(err, this.stackTraceInfo);
            const stackLine = err.stack.split("\n")[4]; // Get the line with caller info
            const match = stackLine.match(/at (.+):(\d+):(\d+)/); // Regex to extract details
            const [_, filename, line, column] = match;
            console.log();
            return `${filename}:${line}:${column}`
        } catch (err) {

        }
        return `-`
    }

    fatal(issueDescription, extra = {}) {
        return this.#add(issueDescription, extra, 'fatal')
    }

    warning(issueDescription, extra = {}) {
        return this.#add(issueDescription, extra, 'warning')
    }

    info(issueDescription, extra = {}) {
        return this.#add(issueDescription, extra, 'info')
    }

    error(issueDescription, extra = {}) {
        return this.#add(issueDescription, extra, 'error')
    }


    #add(issueDescription, extra, level = 'info') {
        // we do not allow the same issue to be reported more than once per minute 
        let hash = Math.abs(CRC32.str(`${this.appName}_issue_${level}_${issueDescription}`))
        if (reports.hasOwnProperty(hash) && Date.now() < reports[hash])
            return false

        let file_content = {
            v: 1,
            issue_id: hash,
            meta: this.meta,
            caller: this.#stackTraceInfo(),
            app: this.appName,
            extra,
            description: issueDescription,
            level,
            t: Date.now()
        }

        reports[hash] = Date.now() + this.options.minimumInterval
        let file_name = `${hash}.coadmin_service`
        let full_filename = path.join(this.options.folder, file_name)
        if (fs.existsSync(this.options.folder)) {
            try {
                fs.writeFileSync(full_filename, JSON.stringify(file_content))
                return full_filename
            } catch (err) {
                return err
            }
        } else {
            return false
        }
    }
}



module.exports = ReportIssues
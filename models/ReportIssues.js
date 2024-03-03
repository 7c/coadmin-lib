/*
  is being developed, subject to change
*/
const debug = require('debug')('_ReportIssues')
const path = require('path')
const fs = require('fs')
const CRC32 = require('crc-32')
const os = require('os')

const defaultOptions = {
    folder: '/var/coadmin',
    minimumInterval: 60 * 1000
}

const reports = {}

class ReportIssues {
    constructor(appName, options = defaultOptions) {
        this.appName = appName.toLowerCase()
        this.options = Object.assign({}, defaultOptions, options)
        this.reported = {}
        this.meta = {
            // dir: __dirname,
            hostname: os.hostname(),
            // filename: require?.main?.filename || process.argv?.[1] || 'unknown'
        }
        debug(this.meta)
    }

    stackTrace(numberOfLinesToFetch = 10) {
        // credit stackoverflow
        const oldStackTrace = Error.prepareStackTrace;
        const BASE_DIR_NAME = process.cwd();
        const boilerplateLines = line => line &&
            line.getFileName() &&
            (line.getFileName().indexOf('<My Module Name>') &&
                (line.getFileName().indexOf('/node_modules/') < 0));
        try {
            // eslint-disable-next-line handle-callback-err
            Error.prepareStackTrace = (err, structuredStackTrace) => structuredStackTrace;
            Error.captureStackTrace(this);
            // we need to "peel" the first CallSites (frames) in order to get to the caller we're looking for
            // in our case we're removing frames that come from logger module or from winston
            const callSites = this.stack.filter(boilerplateLines);
            if (callSites.length === 0) {
                // bail gracefully: even though we shouldn't get here, we don't want to crash for a log print!
                return null;
            }
            const results = [];
            for (let i = 0; i < numberOfLinesToFetch; i++) {
                const callSite = callSites[i];
                if (callSite?.getFileName() && callSite?.getLineNumber()) {
                    let fileName = callSite.getFileName();
                    fileName = fileName.includes(BASE_DIR_NAME) ? fileName.substring(BASE_DIR_NAME.length + 1) : fileName;
                    results.push(fileName + ':' + callSite.getLineNumber());
                }
            }
            return results
        } catch (err) {
            return []
        }
        finally {
            Error.prepareStackTrace = oldStackTrace;
        }
    }



    fatal(issueDescription, extra = {}, options = {}) {
        return this.#add(issueDescription, extra, 'fatal', options)
    }

    warning(issueDescription, extra = {}, options = {}) {
        return this.#add(issueDescription, extra, 'warning', options)
    }

    info(issueDescription, extra = {}, options = {}) {
        return this.#add(issueDescription, extra, 'info', options)
    }

    error(issueDescription, extra = {}, options = {}) {
        return this.#add(issueDescription, extra, 'error', options)
    }


    #add(issueDescription, extra, level = 'info', options = {}) {
        debug(`#add`, issueDescription, extra, level, options)
        // we do not allow the same issue to be reported more than once per minute 
        let hash = Math.abs(CRC32.str(`${this.appName}_issue_${level}_${issueDescription}`))
        if (reports.hasOwnProperty(hash) && Date.now() < reports[hash])
            return false
        const st = this.stackTrace(10)
        let file_content = {
            v: 3,
            issue_id: hash,
            meta: this.meta,
            options: options,
            caller: st.length > 0 ? st[0] : '-',
            stackTrace: Array.isArray(st) ? st : false,
            app: this.appName,
            extra,
            description: issueDescription,
            level,
            t: Date.now()
        }
        debug(file_content)

        reports[hash] = Date.now() + this.options.minimumInterval
        let file_name = `${hash}.coadmin_issue`
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
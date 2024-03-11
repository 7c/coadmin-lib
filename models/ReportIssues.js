/*
  is being developed, subject to change
*/
const errorStackParser = require('error-stack-parser');
const util = require('util');
const debug = require('debug')('_ReportIssues')
const path = require('path')
const fs = require('fs')
const CRC32 = require('crc-32')
const os = require('os')
const pkg = require(path.join(__dirname, '..', 'package.json'))

const defaultOptions = {
    folder: '/var/coadmin',
    minimumInterval: 60 * 1000,
    live: true
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



    fatal(issue, extra = {}, options = {}) {
        return this.#add(issue, extra, 'fatal', options)
    }

    warning(issue, extra = {}, options = {}) {
        return this.#add(issue, extra, 'warning', options)
    }

    info(issue, extra = {}, options = {}) {
        return this.#add(issue, extra, 'info', options)
    }

    error(issue, extra = {}, options = {}) {
        return this.#add(issue, extra, 'error', options)
    }


    #add(issue, extra, level = 'info', options = {}) {
        try {
            debug(`#add`, issue, extra, level, options)
            let st = this.stackTrace(10)
            const st0 = st

            if (typeof issue === 'object' && isError(issue)) {
                let frames = errorStackParser.parse(issue)

                frames = frames.filter(frame => {
                    return !frame.fileName.includes('node:internal/')
                })

                st = frames.map(frame => {
                    return `${frame.fileName}:${frame.functionName}:${frame.lineNumber}`
                })

                extra = Object.assign({}, extra, {
                    // message: issue.message,
                    errno: issue.errno ? issue.errno : false,
                    // stack: frames,
                    // frames: frames
                })
                issue = issue.message
            }

            if (st0) extra.st0 = st0

            const hash = Math.abs(CRC32.str(`${this.appName}_issue_${level}_${issue}`.toLowerCase()))
            // we do not allow the same issue to be reported more than once per minute 
            if (reports.hasOwnProperty(hash) && Date.now() < reports[hash])
                return false

            // console.log(st0)
            let file_content = {
                v: 4,
                issue_id: hash,
                meta: this.meta,
                options: options,
                caller: st0.length > 0 ? st0[0] : '-',
                stackTrace: Array.isArray(st) ? st : false,
                app: this.appName,
                extra,
                description: issue,
                level,
                libversion: pkg?.version || 'unknown',
                t: Date.now()
            }
            debug(file_content)

            reports[hash] = Date.now() + this.options.minimumInterval
            let file_name = `${hash}.coadmin_issue`
            let full_filename = path.join(this.options.folder, file_name)

            if (this.options.live === false) {
                // non live mode will only display the issue file
                console.dir(file_content, { depth: null })
                return true
            }
            fs.writeFileSync(full_filename, JSON.stringify(file_content))
            return true
        } catch (err3) {
            console.log(err3)
        }
        return false
    }
}


function isError(e) {
    return util.types.isNativeError(e);
}


module.exports = ReportIssues
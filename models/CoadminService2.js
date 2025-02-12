/*
  is being developed, subject to change
*/

const path = require('path')
const fs = require('fs')
const CRC32 = require('crc-32')
const os = require('os')

const defaultOptions = {
    folder: '/var/coadmin',
    minimumInterval: 60 * 1000
}

const reports = {}

class CoadminService2 {
    constructor(appName, options = defaultOptions) {
        this.appName = appName.toLowerCase()
        this.options = Object.assign({},defaultOptions, options)
        this.reported = {}
        this.meta = {
            // dir: __dirname,
            hostname: os.hostname(),
            // filename: require?.main?.filename || process.argv?.[1] || 'unknown'
        }

        setInterval(() => {
            console.log(`do not use CoadminService2, it is deprecated`)
        }, 5000)
    }

    #stackTraceInfo() {
        try {
            const err = new Error();
            Error.captureStackTrace(err, this.stackTraceInfo);
            const stackLine = err.stack.split("\n")[4]; // Get the line with caller info
            const match = stackLine.match(/at (.+):(\d+):(\d+)/); // Regex to extract details
            const [_, filename, line, column] = match;
            // console.log();
            return `${filename}:${line}`
        } catch (err) {

        }
        return `-`
    }

    start() {
        console.log('start')
    }

    ping() {
        console.log('ping')
    }

}



module.exports = CoadminService2
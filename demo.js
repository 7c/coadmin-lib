
const ReportIssues = require('./models/ReportIssues.js')

const report = new ReportIssues('demo')

function inner() {
    report.warning('This is a warning issue')
    // console.log(report.stackTrace())
        // console.log(report.stackTraceInfo())
    inner2()
}

function inner2() {
    report.warning('This is a warning issue')
    // console.log(report.stackTrace())
        // console.log(report.stackTraceInfo())
}


async function start() {
    try {
        
        // report.fatal('This is a fatal issue')
        inner()
        // report.info('This is an info issue')
        

    } catch(err) {
        console.log(err)
    }
    process.exit(0)
}

start()
import debug from 'debug'
const ReportIssues  = require("./ReportIssues.js")
const dbg = debug('_ReportIssues')

describe("ReportIssues", () => {
  test("stackTrace", async () => {
    const RI = new ReportIssues("test")
    const stack = RI.stackTrace()
    // console.log(stack)
    expect(stack).toBeDefined()
  })
})

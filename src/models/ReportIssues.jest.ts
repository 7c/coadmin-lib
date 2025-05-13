import debug from 'debug'
import { ReportIssues } from "./ReportIssues"
import fs from 'fs'
import { jest } from '@jest/globals'
import os from 'os'
const dbg = debug('_ReportIssues')
dbg.enabled = dbg.enabled || typeof jest !== 'undefined'


jest.mock('fs', () => ({
  writeFileSync: jest.fn((filename, data) => {
    // console.log("writeFileSync", filename)
  }),
  existsSync: jest.fn((filename) => {
    console.log("existsSync", filename)
    return false
  })
}))

jest.mock('mybase/ts', () => ({
  wait: () => Promise.resolve(),
}))

afterAll(() => {
  jest.restoreAllMocks(); // This will restore all mocks
  // OR restore individual mocks:
  (fs.writeFileSync as jest.Mock).mockRestore();
  (fs.existsSync as jest.Mock).mockRestore();
});

describe("ReportIssues 2", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const reportIssues = new ReportIssues("test")
  test("stackTrace", async () => {
    const stack = reportIssues.stackTrace()
    // console.log(stack) 
    expect(stack).toBeDefined()
  })

  test("create a basic warning should be saved if file does not exist", async () => {
    const identifier = `test-${Date.now()}`
    const warning = reportIssues.warning(identifier)
    console.log(warning)
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect((fs.writeFileSync as jest.Mock).mock.calls[0][1]).toEqual(expect.stringContaining(identifier));
    // data needs to be a valid JSON
    const data = JSON.parse((fs.writeFileSync as jest.Mock).mock.calls[0][1] as string)
    expect(data).toBeDefined()
    expect(data.description).toBe(identifier)
    expect(data.level).toBe('warning')
    expect(data.app).toBe('test')
    expect(data.v).toBe(5)
    expect(data.issue_id).toBeDefined()
    expect(data.meta).toBeDefined()
    expect(data.options).toBeDefined()
    expect(data.caller).toBeDefined()
    expect(data.stackTrace).toBeDefined()
    expect(data.extra).toBeDefined()
    expect(data.libversion).toBeDefined()
    expect(data.t).toBeDefined()
    console.log(data)
    // filename needs to end with '.coadmin_issue'
    const filename = (fs.writeFileSync as jest.Mock).mock.calls[0][0] as string
    expect(filename.endsWith('.coadmin_issue')).toBe(true)
    expect(filename.includes(data.issue_id.toString())).toBe(true)
    // meta should always contain hostname
    expect(data.meta.hostname).toBeDefined()
    expect(data.meta.hostname).toBe(os.hostname())
  })
})

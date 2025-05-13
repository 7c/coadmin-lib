"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const ReportIssues_1 = __importDefault(require("./ReportIssues"));
const fs_1 = __importDefault(require("fs"));
const globals_1 = require("@jest/globals");
const os_1 = __importDefault(require("os"));
const dbg = (0, debug_1.default)('_ReportIssues');
dbg.enabled = dbg.enabled || typeof globals_1.jest !== 'undefined';
globals_1.jest.mock('fs', () => ({
    writeFileSync: globals_1.jest.fn((filename, data) => {
        // console.log("writeFileSync", filename)
    }),
    existsSync: globals_1.jest.fn((filename) => {
        console.log("existsSync", filename);
        return false;
    })
}));
globals_1.jest.mock('mybase/ts', () => ({
    wait: () => Promise.resolve(),
}));
afterAll(() => {
    globals_1.jest.restoreAllMocks(); // This will restore all mocks
    // OR restore individual mocks:
    fs_1.default.writeFileSync.mockRestore();
    fs_1.default.existsSync.mockRestore();
});
describe("ReportIssues 1", () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    const reportIssues = new ReportIssues_1.default("test");
    test("stackTrace", async () => {
        const stack = reportIssues.stackTrace();
        // console.log(stack) 
        expect(stack).toBeDefined();
    });
    test("create a basic warning should be saved if file does not exist", async () => {
        const identifier = `test-${Date.now()}`;
        const warning = reportIssues.warning(identifier);
        console.log(warning);
        expect(fs_1.default.writeFileSync).toHaveBeenCalledTimes(1);
        expect(fs_1.default.writeFileSync.mock.calls[0][1]).toEqual(expect.stringContaining(identifier));
        // data needs to be a valid JSON
        const data = JSON.parse(fs_1.default.writeFileSync.mock.calls[0][1]);
        expect(data).toBeDefined();
        expect(data.description).toBe(identifier);
        expect(data.level).toBe('warning');
        expect(data.app).toBe('test');
        expect(data.v).toBe(5);
        expect(data.issue_id).toBeDefined();
        expect(data.meta).toBeDefined();
        expect(data.options).toBeDefined();
        expect(data.caller).toBeDefined();
        expect(data.stackTrace).toBeDefined();
        expect(data.extra).toBeDefined();
        expect(data.libversion).toBeDefined();
        expect(data.t).toBeDefined();
        // console.log(data)
        // filename needs to end with '.coadmin_issue'
        const filename = fs_1.default.writeFileSync.mock.calls[0][0];
        expect(filename.endsWith('.coadmin_issue')).toBe(true);
        expect(filename.includes(data.issue_id.toString())).toBe(true);
        // meta should always contain hostname
        expect(data.meta.hostname).toBeDefined();
        expect(data.meta.hostname).toBe(os_1.default.hostname());
    });
});
//# sourceMappingURL=ReportIssues.jest.js.map
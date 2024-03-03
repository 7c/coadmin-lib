"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const ReportIssues = require("./ReportIssues.js");
const dbg = (0, debug_1.default)('_ReportIssues');
describe("ReportIssues", () => {
    test("stackTrace", async () => {
        const RI = new ReportIssues("test");
        const stack = RI.stackTrace();
        console.log(stack);
    });
});
//# sourceMappingURL=ReportIssues.jest.js.map
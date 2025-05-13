"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_stack_parser_1 = __importDefault(require("error-stack-parser"));
const ts_1 = require("mybase/ts");
const util_1 = __importDefault(require("util"));
const debug_1 = __importDefault(require("debug"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crc_32_1 = __importDefault(require("crc-32"));
const os_1 = __importDefault(require("os"));
// Ensure tsconfig.json has "resolveJsonModule": true
const package_json_1 = __importDefault(require("../../package.json"));
const myioframework_1 = require("@7c/myioframework");
// -----------------------------------------------------------------------------
// Constants & Helpers
// -----------------------------------------------------------------------------
const defaultReportOptions = {
    live: false,
    folder: '/var/coadmin',
    server: 'https://127.0.0.1:3000/api',
    server_path: '/socket.io',
    minimumInterval: 60 * 1000,
    output: false,
};
const reports = {};
function isError(e) {
    return util_1.default.types.isNativeError(e);
}
const debug = (0, debug_1.default)('_ReportIssues');
debug.enabled = debug.enabled || typeof jest !== 'undefined';
// -----------------------------------------------------------------------------
// Main class
// -----------------------------------------------------------------------------
class ReportIssues {
    constructor(appName, options = defaultReportOptions) {
        this.socket = null;
        this.buffer = [];
        this.reported = {};
        this.appName = appName.toLowerCase().trim();
        this.reportOptions = Object.assign(Object.assign({}, defaultReportOptions), options);
        this.meta = {
            hostname: os_1.default.hostname(),
        };
        debug(this.meta);
        if (this.reportOptions.live) {
            this.socket = new myioframework_1.MYIOClient({ url: this.reportOptions.server, name: 'coadmin-lib', output: this.reportOptions.output }, { path: this.reportOptions.server_path });
            this.socket.connect();
            void this.liveWorker();
        }
    }
    // ---------------------------------------------------------------------------
    // Public helpers (severity wrappers)
    // ---------------------------------------------------------------------------
    fatal(issue, extra = {}, opts = {}) {
        return this.add(issue, extra, 'fatal', opts);
    }
    warning(issue, extra = {}, opts = {}) {
        return this.add(issue, extra, 'warning', opts);
    }
    debug(issue, extra = {}, opts = {}) {
        return this.add(issue, extra, 'debug', opts);
    }
    info(issue, extra = {}, opts = {}) {
        return this.add(issue, extra, 'info', opts);
    }
    error(issue, extra = {}, opts = {}) {
        return this.add(issue, extra, 'error', opts);
    }
    // ---------------------------------------------------------------------------
    // Core logic
    // ---------------------------------------------------------------------------
    async liveWorker() {
        var _a;
        if (!this.reportOptions.live || !this.socket)
            return;
        debug('liveWorker has been started');
        while (true) {
            try {
                // @ts-ignore
                if ((_a = this.socket) === null || _a === void 0 ? void 0 : _a.isConnected) {
                    const payload = this.buffer.shift();
                    if (payload) {
                        debug(`submitting payload | app: ${payload.app} | level: ${payload.level} | issue_id: ${payload.issue_id} | description: ${payload.description}`);
                        this.socket.emit('issues.submit', payload);
                    }
                }
            }
            catch (err) {
                console.error('coadmin-lib:ReportIssues:liveWorker error', err);
                await (0, ts_1.wait)(1);
            }
            await (0, ts_1.wait)(0.1);
        }
    }
    stackTrace(lines = 10) {
        const oldStackTrace = Error.prepareStackTrace;
        const BASE_DIR_NAME = process.cwd();
        const boilerplateLines = (line) => !!(line &&
            line.getFileName() &&
            line.getFileName().indexOf('<My Module Name>') &&
            line.getFileName().indexOf('/node_modules/') < 0);
        try {
            Error.prepareStackTrace = (_err, structured) => structured;
            Error.captureStackTrace(this);
            // @ts-ignore – we know stack is now CallSite[]
            const callSites = this.stack.filter(boilerplateLines);
            if (callSites.length === 0)
                return [];
            return callSites.slice(0, lines).map((cs) => {
                let fileName = cs.getFileName() || '';
                fileName = fileName.includes(BASE_DIR_NAME)
                    ? fileName.substring(BASE_DIR_NAME.length + 1)
                    : fileName;
                return `${fileName}:${cs.getLineNumber()}`;
            });
        }
        catch (_a) {
            return [];
        }
        finally {
            Error.prepareStackTrace = oldStackTrace;
        }
    }
    generateIssue(issue, extra, level = 'info', issueOptions = {}) {
        var _a, _b, _c;
        try {
            debug('#generate', issue, extra, level, issueOptions);
            let st = this.stackTrace(10);
            const st0 = st;
            if (isError(issue)) {
                let frames = error_stack_parser_1.default.parse(issue);
                frames = frames.filter((f) => { var _a; return !((_a = f.fileName) === null || _a === void 0 ? void 0 : _a.includes('node:internal/')); });
                st = frames.map((f) => `${f.fileName}:${f.functionName}:${f.lineNumber}`);
                extra = Object.assign(Object.assign({}, extra), { errno: (_a = issue.errno) !== null && _a !== void 0 ? _a : false });
                issue = issue.message;
            }
            if (st0.length)
                extra.st0 = st0;
            const hash = Math.abs(crc_32_1.default.str(`${this.appName}_issue_${level}_${String(issue)}`.toLowerCase()));
            if (reports[hash] && Date.now() < reports[hash])
                return false;
            reports[hash] = Date.now() + this.reportOptions.minimumInterval;
            return {
                v: 5,
                issue_id: hash,
                meta: this.meta,
                options: issueOptions,
                caller: (_b = st0[0]) !== null && _b !== void 0 ? _b : '-',
                stackTrace: st.length ? st : false,
                app: this.appName,
                extra,
                description: String(issue),
                level,
                libversion: (_c = package_json_1.default.version) !== null && _c !== void 0 ? _c : 'unknown',
                t: Date.now(),
            };
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
    add(issue, extra, level = 'info', issueOptions = {}) {
        try {
            debug('#add');
            const issueGenerated = this.generateIssue(issue, extra, level, issueOptions);
            if (!issueGenerated)
                return false;
            if (this.reportOptions.live) {
                this.buffer.push(issueGenerated);
                debug(`#add:++buffer ${this.buffer.length}`);
            }
            else {
                const fileName = `${issueGenerated.issue_id}.coadmin_issue`;
                const fullPath = path_1.default.join(this.reportOptions.folder, fileName);
                debug('#add:file', fullPath);
                fs_1.default.writeFileSync(fullPath, JSON.stringify(issueGenerated));
                debug('#add:success', fullPath);
            }
            return true;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
}
exports.default = ReportIssues;
//# sourceMappingURL=ReportIssues.js.map
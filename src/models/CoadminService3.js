"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoadminService3 = void 0;
const debug_1 = __importDefault(require("debug"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const CRC32 = __importStar(require("crc-32"));
const ts_1 = require("mybase/ts");
// default options
const defaultOptions = {
    folder: '/var/coadmin',
    ping: true,
    reportInterval: ts_1.Timespan.minutes(1),
    debug: false
};
class CoadminService3 {
    constructor(serviceName, options = defaultOptions) {
        var _a, _b, _c;
        this.serviceName = serviceName;
        this.reported = {};
        this.meta = {
            dir: __dirname,
            filename: ((_a = require === null || require === void 0 ? void 0 : require.main) === null || _a === void 0 ? void 0 : _a.filename) || ((_b = process.argv) === null || _b === void 0 ? void 0 : _b[1]) || 'unknown'
        };
        this.log = (0, debug_1.default)(`${this.serviceName}`);
        this.options = Object.assign(Object.assign({}, defaultOptions), options);
        this.log.enabled = (_c = options.debug) !== null && _c !== void 0 ? _c : false;
        if (!options.serviceDescription)
            this.options.serviceDescription = this.serviceName;
        this.log('constructor', this.serviceName, this.options);
        // auto pinger every minute
        if (this.options.ping) {
            this.log('enabling pinger for', this.serviceName);
            this.reportSuccess('ping'); // first ping
            setInterval(() => { this.reportSuccess('ping'); }, this.options.reportInterval.miliseconds);
        }
    }
    reportSuccess(operation, params = {}) {
        return this.report(operation, params);
    }
    isReady() {
        var _a;
        // log('isReady', this.options?.folder, fs.existsSync(this.options.folder))
        return !!(((_a = this.options) === null || _a === void 0 ? void 0 : _a.folder) && fs_1.default.existsSync(this.options.folder));
    }
    reportError(operation, params = {}) {
        return this.report(operation, params, true);
    }
    calculateServiceFilename(operation) {
        const file_name = Math.abs(CRC32.str(`${this.serviceName}_${operation}`)) + '.coadmin_service';
        this.log('calculateServiceFilename', file_name);
        return path_1.default.join(this.options.folder || defaultOptions.folder, file_name);
    }
    report(operation, params, is_error = false) {
        if (!this.isReady())
            return false;
        if (!this.reported.hasOwnProperty(operation))
            this.reported[operation] = ts_1.Unixtime.now().addYears(-10);
        if (this.reported[operation].elapsed.seconds < this.options.reportInterval.seconds) {
            // report is too frequent
            return false;
        }
        this.reported[operation] = ts_1.Unixtime.now();
        const file_content = {
            v: 3,
            meta: this.meta,
            service: this.serviceName,
            operation,
            params,
            error: is_error,
            t: Date.now()
        };
        const full_filename = this.calculateServiceFilename(operation);
        try {
            fs_1.default.writeFileSync(full_filename, JSON.stringify(file_content));
            this.log(`report:success ${operation} ${full_filename}`);
            return full_filename;
        }
        catch (err) {
            this.log(`report:error ${operation} ${full_filename}`, err);
            return err;
        }
    }
}
exports.CoadminService3 = CoadminService3;
//# sourceMappingURL=CoadminService3.js.map
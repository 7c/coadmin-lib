"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppetSummary = void 0;
const fs_1 = require("fs");
const js_yaml_1 = require("js-yaml");
const chalk_1 = __importDefault(require("chalk"));
class PuppetSummary {
    constructor(PuppetSummaryFile) {
        const yamlContent = (0, fs_1.readFileSync)(PuppetSummaryFile, 'utf8');
        const parsed = (0, js_yaml_1.load)(yamlContent);
        this.data = this.processData(parsed);
    }
    getSummary() {
        const sections = [];
        // Version and Environment Info
        sections.push(chalk_1.default.bold.blue('🔍 Puppet Run Summary'));
        sections.push(`${chalk_1.default.dim('Last Run:')} ${chalk_1.default.yellow(this.formatDate(this.data.version.config))}\n` +
            `${chalk_1.default.dim('Last Run Ago:')} ${chalk_1.default.yellow(this.data.version.config ? this.formatTimeAgo(Date.now() - this.data.version.config.getTime()) : 'N/A')}\n` +
            `${chalk_1.default.dim('Puppet Version:')} ${chalk_1.default.green(this.data.version.puppet)}\n` +
            `${chalk_1.default.dim('Environment:')} ${chalk_1.default.cyan(this.data.application.converged_environment)}`);
        // Resources Summary
        const resourcesInfo = this.data.resources;
        sections.push(chalk_1.default.bold.blue('\n📦 Resources'));
        sections.push(`${chalk_1.default.dim('Total:')} ${chalk_1.default.white(resourcesInfo.total)}\n` +
            `${chalk_1.default.dim('Changed:')} ${chalk_1.default.yellow(resourcesInfo.changed)}\n` +
            `${chalk_1.default.dim('Failed:')} ${this.formatFailureCount(resourcesInfo.failed)}\n` +
            `${chalk_1.default.dim('Out of Sync:')} ${chalk_1.default.yellow(resourcesInfo.out_of_sync)}`);
        // Events Summary
        const eventsInfo = this.data.events;
        sections.push(chalk_1.default.bold.blue('\n🎯 Events'));
        sections.push(`${chalk_1.default.dim('Success:')} ${chalk_1.default.green(eventsInfo.success)}\n` +
            `${chalk_1.default.dim('Failure:')} ${this.formatFailureCount(eventsInfo.failure)}\n` +
            `${chalk_1.default.dim('Total:')} ${chalk_1.default.white(eventsInfo.total)}`);
        // Time Summary
        const timeInfo = this.data.time;
        sections.push(chalk_1.default.bold.blue('\n⏱️ Timing'));
        sections.push(`${chalk_1.default.dim('Total Time:')} ${chalk_1.default.magenta(this.formatDuration(timeInfo.total))}\n` +
            `${chalk_1.default.dim('Config Retrieval:')} ${chalk_1.default.magenta(this.formatDuration(timeInfo.config_retrieval))}\n` +
            `${chalk_1.default.dim('Catalog Application:')} ${chalk_1.default.magenta(this.formatDuration(timeInfo.catalog_application))}`);
        return sections.join('\n');
    }
    processData(parsedData) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64;
        return {
            version: {
                config: ((_a = parsedData.version) === null || _a === void 0 ? void 0 : _a.config) ? new Date(parsedData.version.config * 1000) : null,
                puppet: (_c = (_b = parsedData.version) === null || _b === void 0 ? void 0 : _b.puppet) !== null && _c !== void 0 ? _c : null,
            },
            application: {
                run_mode: (_e = (_d = parsedData.application) === null || _d === void 0 ? void 0 : _d.run_mode) !== null && _e !== void 0 ? _e : null,
                initial_environment: (_g = (_f = parsedData.application) === null || _f === void 0 ? void 0 : _f.initial_environment) !== null && _g !== void 0 ? _g : null,
                converged_environment: (_j = (_h = parsedData.application) === null || _h === void 0 ? void 0 : _h.converged_environment) !== null && _j !== void 0 ? _j : null,
            },
            resources: {
                changed: (_l = (_k = parsedData.resources) === null || _k === void 0 ? void 0 : _k.changed) !== null && _l !== void 0 ? _l : null,
                corrective_change: (_o = (_m = parsedData.resources) === null || _m === void 0 ? void 0 : _m.corrective_change) !== null && _o !== void 0 ? _o : null,
                failed: (_q = (_p = parsedData.resources) === null || _p === void 0 ? void 0 : _p.failed) !== null && _q !== void 0 ? _q : null,
                failed_to_restart: (_s = (_r = parsedData.resources) === null || _r === void 0 ? void 0 : _r.failed_to_restart) !== null && _s !== void 0 ? _s : null,
                out_of_sync: (_u = (_t = parsedData.resources) === null || _t === void 0 ? void 0 : _t.out_of_sync) !== null && _u !== void 0 ? _u : null,
                restarted: (_w = (_v = parsedData.resources) === null || _v === void 0 ? void 0 : _v.restarted) !== null && _w !== void 0 ? _w : null,
                scheduled: (_y = (_x = parsedData.resources) === null || _x === void 0 ? void 0 : _x.scheduled) !== null && _y !== void 0 ? _y : null,
                skipped: (_0 = (_z = parsedData.resources) === null || _z === void 0 ? void 0 : _z.skipped) !== null && _0 !== void 0 ? _0 : null,
                total: (_2 = (_1 = parsedData.resources) === null || _1 === void 0 ? void 0 : _1.total) !== null && _2 !== void 0 ? _2 : null,
            },
            time: {
                anchor: (_4 = (_3 = parsedData.time) === null || _3 === void 0 ? void 0 : _3.anchor) !== null && _4 !== void 0 ? _4 : null,
                apt_key: (_6 = (_5 = parsedData.time) === null || _5 === void 0 ? void 0 : _5.apt_key) !== null && _6 !== void 0 ? _6 : null,
                archive: (_8 = (_7 = parsedData.time) === null || _7 === void 0 ? void 0 : _7.archive) !== null && _8 !== void 0 ? _8 : null,
                catalog_application: (_10 = (_9 = parsedData.time) === null || _9 === void 0 ? void 0 : _9.catalog_application) !== null && _10 !== void 0 ? _10 : null,
                concat_file: (_12 = (_11 = parsedData.time) === null || _11 === void 0 ? void 0 : _11.concat_file) !== null && _12 !== void 0 ? _12 : null,
                concat_fragment: (_14 = (_13 = parsedData.time) === null || _13 === void 0 ? void 0 : _13.concat_fragment) !== null && _14 !== void 0 ? _14 : null,
                config_retrieval: (_16 = (_15 = parsedData.time) === null || _15 === void 0 ? void 0 : _15.config_retrieval) !== null && _16 !== void 0 ? _16 : null,
                convert_catalog: (_18 = (_17 = parsedData.time) === null || _17 === void 0 ? void 0 : _17.convert_catalog) !== null && _18 !== void 0 ? _18 : null,
                cron: (_20 = (_19 = parsedData.time) === null || _19 === void 0 ? void 0 : _19.cron) !== null && _20 !== void 0 ? _20 : null,
                debconf: (_22 = (_21 = parsedData.time) === null || _21 === void 0 ? void 0 : _21.debconf) !== null && _22 !== void 0 ? _22 : null,
                exec: (_24 = (_23 = parsedData.time) === null || _23 === void 0 ? void 0 : _23.exec) !== null && _24 !== void 0 ? _24 : null,
                fact_generation: (_26 = (_25 = parsedData.time) === null || _25 === void 0 ? void 0 : _25.fact_generation) !== null && _26 !== void 0 ? _26 : null,
                file: (_28 = (_27 = parsedData.time) === null || _27 === void 0 ? void 0 : _27.file) !== null && _28 !== void 0 ? _28 : null,
                file_line: (_30 = (_29 = parsedData.time) === null || _29 === void 0 ? void 0 : _29.file_line) !== null && _30 !== void 0 ? _30 : null,
                filebucket: (_32 = (_31 = parsedData.time) === null || _31 === void 0 ? void 0 : _31.filebucket) !== null && _32 !== void 0 ? _32 : null,
                group: (_34 = (_33 = parsedData.time) === null || _33 === void 0 ? void 0 : _33.group) !== null && _34 !== void 0 ? _34 : null,
                notify: (_36 = (_35 = parsedData.time) === null || _35 === void 0 ? void 0 : _35.notify) !== null && _36 !== void 0 ? _36 : null,
                package: (_38 = (_37 = parsedData.time) === null || _37 === void 0 ? void 0 : _37.package) !== null && _38 !== void 0 ? _38 : null,
                plugin_sync: (_40 = (_39 = parsedData.time) === null || _39 === void 0 ? void 0 : _39.plugin_sync) !== null && _40 !== void 0 ? _40 : null,
                schedule: (_42 = (_41 = parsedData.time) === null || _41 === void 0 ? void 0 : _41.schedule) !== null && _42 !== void 0 ? _42 : null,
                service: (_44 = (_43 = parsedData.time) === null || _43 === void 0 ? void 0 : _43.service) !== null && _44 !== void 0 ? _44 : null,
                ssh_authorized_key: (_46 = (_45 = parsedData.time) === null || _45 === void 0 ? void 0 : _45.ssh_authorized_key) !== null && _46 !== void 0 ? _46 : null,
                total: (_48 = (_47 = parsedData.time) === null || _47 === void 0 ? void 0 : _47.total) !== null && _48 !== void 0 ? _48 : null,
                transaction_evaluation: (_50 = (_49 = parsedData.time) === null || _49 === void 0 ? void 0 : _49.transaction_evaluation) !== null && _50 !== void 0 ? _50 : null,
                user: (_52 = (_51 = parsedData.time) === null || _51 === void 0 ? void 0 : _51.user) !== null && _52 !== void 0 ? _52 : null,
                vcsrepo: (_54 = (_53 = parsedData.time) === null || _53 === void 0 ? void 0 : _53.vcsrepo) !== null && _54 !== void 0 ? _54 : null,
                last_run: (_56 = (_55 = parsedData.time) === null || _55 === void 0 ? void 0 : _55.last_run) !== null && _56 !== void 0 ? _56 : null,
            },
            changes: {
                total: (_58 = (_57 = parsedData.changes) === null || _57 === void 0 ? void 0 : _57.total) !== null && _58 !== void 0 ? _58 : null,
            },
            events: {
                failure: (_60 = (_59 = parsedData.events) === null || _59 === void 0 ? void 0 : _59.failure) !== null && _60 !== void 0 ? _60 : null,
                success: (_62 = (_61 = parsedData.events) === null || _61 === void 0 ? void 0 : _61.success) !== null && _62 !== void 0 ? _62 : null,
                total: (_64 = (_63 = parsedData.events) === null || _63 === void 0 ? void 0 : _63.total) !== null && _64 !== void 0 ? _64 : null,
            },
        };
    }
    // Getter methods for each section
    getVersion() {
        return this.data.version;
    }
    getApplication() {
        return this.data.application;
    }
    getResources() {
        return this.data.resources;
    }
    getTime() {
        return this.data.time;
    }
    getChanges() {
        return this.data.changes;
    }
    getEvents() {
        return this.data.events;
    }
    // Helper method to get total execution time
    getTotalExecutionTime() {
        return this.data.time.total;
    }
    // Helper method to check if there were any failures
    hasFailures() {
        var _a, _b;
        return ((_a = this.data.events.failure) !== null && _a !== void 0 ? _a : 0) > 0 || ((_b = this.data.resources.failed) !== null && _b !== void 0 ? _b : 0) > 0;
    }
    formatDate(date) {
        if (!date)
            return 'N/A';
        return date.toISOString();
    }
    formatFailureCount(count) {
        if (!count)
            return chalk_1.default.green('0');
        return chalk_1.default.red(`${count}`);
    }
    formatDuration(seconds) {
        if (seconds === null)
            return 'N/A';
        if (seconds < 1)
            return `${(seconds * 1000).toFixed(2)}ms`;
        return `${seconds.toFixed(2)}s`;
    }
    // Add this helper function to format the time difference
    formatTimeAgo(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const secondsDisplay = seconds % 60;
        const minutesDisplay = minutes % 60;
        const hoursDisplay = hours % 24;
        return [
            days > 0 ? `${days}d` : '',
            hoursDisplay > 0 ? `${hoursDisplay}h` : '',
            minutesDisplay > 0 ? `${minutesDisplay}m` : '',
            `${secondsDisplay}s`
        ].filter(Boolean).join(' ');
    }
}
exports.PuppetSummary = PuppetSummary;
if (require.main === module) {
    const puppetSummary = new PuppetSummary('/opt/puppetlabs/puppet/public/last_run_summary.yaml');
    // Access the data
    console.log(puppetSummary.getSummary()); // Date object
}
//# sourceMappingURL=PuppetSummary.js.map
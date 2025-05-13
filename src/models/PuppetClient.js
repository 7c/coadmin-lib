"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppetClient = void 0;
const debug_1 = __importDefault(require("debug"));
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const log = (0, debug_1.default)('_PuppetClient');
const isJestRunning = log.enabled || typeof jest !== 'undefined';
/**
 * This class is used to determine the puppet binary and the puppet summary file.
 * It is used by the PuppetSummary class to get the puppet summary file and the puppet binary.
 */
class PuppetClient {
    /**
     * Constructor
     * @throws Error if no puppet binary or puppet summary file is found
     */
    constructor() {
        this.possiblePuppetSummaryFileLocations = [
            '/opt/puppetlabs/puppet/public/last_run_summary.yaml',
            '/var/cache/puppet/public/last_run_summary.yaml',
        ];
        this.possiblePuppetBinaryLocations = [
            '/opt/puppetlabs/bin/puppet',
            '/usr/bin/puppet',
        ];
        log('constructor');
        this.puppetBinary = this.determinePuppetBinary(); // it is important that this is set first
        this.puppetSummaryFile = this.determinePuppetSummaryFile();
        log('puppetBinary', this.puppetBinary);
        log('puppetSummaryFile', this.puppetSummaryFile);
    }
    determinePuppetBinary() {
        for (const file of this.possiblePuppetBinaryLocations)
            if (fs_1.default.existsSync(file))
                return file;
        throw new Error('No puppet binary found');
    }
    determinePuppetSummaryFile() {
        log('determinePuppetSummaryFile');
        // first check if the file exists in the possible locations
        for (const file of this.possiblePuppetSummaryFileLocations) {
            log('checking file', file);
            if (fs_1.default.existsSync(file))
                return file;
        }
        // if the file does not exist, try to determine it from the puppet binary
        if (this.puppetBinary) {
            log('determining puppet summary file from puppet binary', this.puppetBinary);
            const summary = (0, child_process_1.execSync)(`${this.puppetBinary} config print lastrunfile`).toString().trim();
            log(`returned '${summary}'`);
            if (fs_1.default.existsSync(summary))
                return summary;
        }
        throw new Error('No puppet summary file found');
    }
}
exports.PuppetClient = PuppetClient;
//# sourceMappingURL=PuppetClient.js.map
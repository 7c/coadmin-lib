import debug from "debug";
import { execSync } from "child_process";
import fs from 'fs';

const log = debug('_PuppetClient');
const isJestRunning = log.enabled ||  typeof jest !== 'undefined';


/**
 * This class is used to determine the puppet binary and the puppet summary file.
 * It is used by the PuppetSummary class to get the puppet summary file and the puppet binary.
 */
export class PuppetClient {
    readonly puppetSummaryFile: string;
    readonly puppetBinary: string;
    possiblePuppetSummaryFileLocations = [
        '/opt/puppetlabs/puppet/public/last_run_summary.yaml',
        '/var/cache/puppet/public/last_run_summary.yaml',
    ]
    possiblePuppetBinaryLocations = [
        '/opt/puppetlabs/bin/puppet',
        '/usr/bin/puppet',
    ]

    /**
     * Constructor
     * @throws Error if no puppet binary or puppet summary file is found
     */
    constructor() {
        log('constructor');
        this.puppetBinary = this.determinePuppetBinary(); // it is important that this is set first
        this.puppetSummaryFile = this.determinePuppetSummaryFile();
        log('puppetBinary', this.puppetBinary);
        log('puppetSummaryFile', this.puppetSummaryFile);
    }
    
    determinePuppetBinary() : string { //~ tested
        for (const file of this.possiblePuppetBinaryLocations) 
            if (fs.existsSync(file)) return file;
        
        throw new Error('No puppet binary found');
    }

    
    determinePuppetSummaryFile() : string {//~ tested
        log('determinePuppetSummaryFile');
        // first check if the file exists in the possible locations
        for (const file of this.possiblePuppetSummaryFileLocations){
            log('checking file', file);
            if (fs.existsSync(file)) return file;
        }
        // if the file does not exist, try to determine it from the puppet binary
        if (this.puppetBinary) {
            log('determining puppet summary file from puppet binary', this.puppetBinary);
            const summary = execSync(`${this.puppetBinary} config print lastrunfile`).toString().trim();
            log(`returned '${summary}'`);
            if (fs.existsSync(summary)) return summary;
        }
        throw new Error('No puppet summary file found');
    }
}
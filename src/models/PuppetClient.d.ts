/**
 * This class is used to determine the puppet binary and the puppet summary file.
 * It is used by the PuppetSummary class to get the puppet summary file and the puppet binary.
 */
export declare class PuppetClient {
    readonly puppetSummaryFile: string;
    readonly puppetBinary: string;
    possiblePuppetSummaryFileLocations: string[];
    possiblePuppetBinaryLocations: string[];
    /**
     * Constructor
     * @throws Error if no puppet binary or puppet summary file is found
     */
    constructor();
    determinePuppetBinary(): string;
    determinePuppetSummaryFile(): string;
}
//# sourceMappingURL=PuppetClient.d.ts.map
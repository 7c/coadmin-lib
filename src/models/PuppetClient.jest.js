"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const PuppetClient_1 = require("./PuppetClient");
const platform = os_1.default.platform();
if (platform == 'linux') {
    describe.skip('PuppetClient', () => {
        it('should determine the puppet binary', () => {
            const puppetClient = new PuppetClient_1.PuppetClient();
            expect(puppetClient.puppetBinary).toBeDefined();
        });
        it('should determine the puppet summary file', () => {
            const puppetClient = new PuppetClient_1.PuppetClient();
            expect(puppetClient.puppetSummaryFile).toBeDefined();
        });
        it('should be able to determine summary file with execSync if needed', () => {
            const puppetClient = new PuppetClient_1.PuppetClient();
            expect(puppetClient.puppetBinary).toBeDefined();
            puppetClient.possiblePuppetSummaryFileLocations = [];
            expect(puppetClient.determinePuppetSummaryFile()).toBeDefined();
            expect(puppetClient.puppetSummaryFile).toBeDefined();
        });
    });
}
else {
    console.log('❌ This test must be run on a Linux system, skipping...');
    describe.skip('PuppetClient', () => {
        it('should not run on non-Linux systems', () => {
            expect(true).toBe(true);
        });
    });
}
//# sourceMappingURL=PuppetClient.jest.js.map
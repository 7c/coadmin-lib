import os from 'os';
import { PuppetClient } from './PuppetClient';
const platform = os.platform();

if (platform == 'linux') {
    describe.skip('PuppetClient', () => {
        it('should determine the puppet binary', () => {
            const puppetClient = new PuppetClient();
            expect(puppetClient.puppetBinary).toBeDefined();
        });
        it('should determine the puppet summary file', () => {
            const puppetClient = new PuppetClient();
            expect(puppetClient.puppetSummaryFile).toBeDefined();
        });

        it('should be able to determine summary file with execSync if needed', () => {
            const puppetClient = new PuppetClient();
            expect(puppetClient.puppetBinary).toBeDefined();
            puppetClient.possiblePuppetSummaryFileLocations = []
            expect(puppetClient.determinePuppetSummaryFile()).toBeDefined();
            expect(puppetClient.puppetSummaryFile).toBeDefined();
        });
    })
}
else {
    console.log('❌ This test must be run on a Linux system, skipping...');
    describe.skip('PuppetClient', () => {
        it('should not run on non-Linux systems', () => {
            expect(true).toBe(true);
        });
    });
}
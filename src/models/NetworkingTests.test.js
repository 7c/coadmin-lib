"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NetworkingTests_1 = require("./NetworkingTests");
const net_1 = __importDefault(require("net"));
describe("Networking", () => {
    describe("isTCPPortListening", () => {
        test("should resolve with true if the port is open", async () => {
            const port = 18080;
            const server = net_1.default.createServer();
            server.listen(port, '127.0.0.1');
            const result = await NetworkingTests_1.NetworkingTests.isTCPPortListening(port);
            server.close();
            expect(result).toBe(true);
        });
        test("should return false if the port is not listening", async () => {
            const port = 18081;
            const result = await NetworkingTests_1.NetworkingTests.isTCPPortListening(port);
            expect(result).toBe(false);
        });
    });
});
//# sourceMappingURL=NetworkingTests.test.js.map
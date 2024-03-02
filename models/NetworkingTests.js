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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tests = void 0;
const net = __importStar(require("net"));
var Tests;
(function (Tests) {
    class Networking {
        static async isTCPPortListening(port, ip = '127.0.0.1') {
            return new Promise(async (resolve, reject) => {
                // Validate IP address
                if (net.isIP(ip) === 0) {
                    return resolve('Invalid IP address');
                }
                const server = net.createServer();
                let checkPort = new Promise((resolveInner, reject) => {
                    server.on('error', (err) => {
                        if (err.message.includes('EADDRINUSE'))
                            resolveInner(true);
                        // any error should raise problem
                        resolveInner(`error: ${err.message}`);
                    });
                    server.on('listening', () => {
                        resolveInner(false);
                    });
                });
                server.listen(port, ip);
                let res = await checkPort;
                let to = setTimeout(() => {
                    return resolve(res);
                }, 1000);
                server.on('close', () => {
                    clearTimeout(to);
                    return resolve(res);
                });
                server.close();
                return;
            });
        }
    }
    Tests.Networking = Networking;
})(Tests || (exports.Tests = Tests = {}));
//# sourceMappingURL=NetworkingTests.js.map
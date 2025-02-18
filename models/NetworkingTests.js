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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkingTests = void 0;
const net = __importStar(require("net"));
class NetworkingTests {
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
exports.NetworkingTests = NetworkingTests;
//# sourceMappingURL=NetworkingTests.js.map
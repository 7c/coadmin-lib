"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mysql2Tests = void 0;
const debug_1 = __importDefault(require("debug"));
const dbg = (0, debug_1.default)('_Mysql2Tests');
class Mysql2Tests {
    static async isAlive(mysql2handle) {
        return new Promise(async (resolve, reject) => {
            if (!mysql2handle)
                return resolve('mysql2handle is null');
            dbg('pinging mysql2handle');
            try {
                await mysql2handle.ping();
                resolve(true);
            }
            catch (error) {
                console.log(error);
                resolve(false);
            }
        });
    }
}
exports.Mysql2Tests = Mysql2Tests;
//# sourceMappingURL=Mysql2Tests.js.map
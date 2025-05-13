"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mysql1Tests = void 0;
const debug_1 = __importDefault(require("debug"));
const dbg = (0, debug_1.default)('_Mysql1Tests');
class Mysql1Tests {
    static async isConnectionAlive(mysql1handle, timeoutSeconds = 5) {
        return new Promise(async (resolve, reject) => {
            if (!mysql1handle)
                return resolve('mysql1handle is null');
            dbg('pinging mysql1handle');
            const timeout = setTimeout(() => {
                resolve(`Connection check timed out after ${timeoutSeconds} seconds`);
            }, timeoutSeconds * 1000);
            try {
                mysql1handle.ping((err) => {
                    if (err)
                        return resolve(`${err.message}`);
                    resolve(true);
                });
            }
            catch (err) {
                if (err instanceof Error)
                    return resolve(`Error in ping: ${err.message}`);
                resolve(`Error in ping: ${err}`);
            }
            finally {
                clearTimeout(timeout);
            }
            return;
        });
    }
    static async isPoolAlive(mysql1pool, timeoutSeconds = 5) {
        return new Promise(async (resolve, reject) => {
            if (!mysql1pool)
                return resolve('mysql1pool is null');
            dbg('pinging mysql1pool');
            const timeout = setTimeout(() => {
                resolve(`Connection check timed out after ${timeoutSeconds} seconds`);
            }, timeoutSeconds * 1000);
            try {
                mysql1pool.getConnection((err, connection) => {
                    if (err) {
                        if (connection)
                            connection.release(); // Release the connection back to the pool if exists
                        return resolve(`${err.message}`);
                    }
                    connection.ping((err) => {
                        connection.release(); // Release the connection back to the pool
                        if (err)
                            return resolve(`${err.message}`);
                        resolve(true);
                    });
                });
            }
            catch (err) {
                if (err instanceof Error)
                    return resolve(`Error in getConnection: ${err.message}`);
                resolve(`Error in getConnection: ${err}`);
            }
            finally {
                clearTimeout(timeout);
            }
            return;
        });
    }
}
exports.Mysql1Tests = Mysql1Tests;
//# sourceMappingURL=Mysql1Tests.js.map
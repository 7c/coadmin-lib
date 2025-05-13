import debug from 'debug'
import mysql2, { Connection } from 'mysql2/promise';
const dbg = debug('_Mysql2Tests')

export class Mysql2Tests {
    static async isAlive(mysql2handle: mysql2.Connection): Promise<boolean | string> {
        return new Promise(async (resolve, reject) => {
            if (!mysql2handle) return resolve('mysql2handle is null')
            dbg('pinging mysql2handle')
            try {
                await mysql2handle.ping()
                resolve(true)
            } catch (error) {
                console.log(error)
                resolve(false)
            }
        })
    }
}

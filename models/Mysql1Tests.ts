import debug from 'debug'
import mysql from 'mysql'
const dbg = debug('_Mysql1Tests')

export class Mysql1Tests {
    static async isConnectionAlive(mysql1handle: mysql.Connection, timeoutSeconds: number = 5): Promise<boolean | string> {
        return new Promise(async (resolve, reject) => {
            if (!mysql1handle) return resolve('mysql1handle is null')
            dbg('pinging mysql1handle')
            const timeout = setTimeout(() => {
                resolve(`Connection check timed out after ${timeoutSeconds} seconds`)
            }, timeoutSeconds * 1000)
            try {
                mysql1handle.ping((err: mysql.MysqlError) => {
                    if (err) return resolve(`${err.message}`)
                    resolve(true)
                })
            } catch (err) {
                if (err instanceof Error) 
                    return resolve(`Error in ping: ${err.message}`)
                resolve(`Error in ping: ${err}`)
            } finally {
                clearTimeout(timeout)
            }
            return
        })
    }

    static async isPoolAlive(mysql1pool: mysql.Pool, timeoutSeconds: number = 5): Promise<boolean | string> {
        return new Promise(async (resolve, reject) => {
            if (!mysql1pool) return resolve('mysql1pool is null')
            dbg('pinging mysql1pool')
        
            const timeout = setTimeout(() => {
                resolve(`Connection check timed out after ${timeoutSeconds} seconds`)
            }, timeoutSeconds * 1000)

            try {
                mysql1pool.getConnection((err: mysql.MysqlError, connection: mysql.PoolConnection) => {
                    if (err) {
                        if (connection) connection.release(); // Release the connection back to the pool if exists
                        return resolve(`${err.message}`)
                    }
                    connection.ping((err: mysql.MysqlError) => {
                        connection.release(); // Release the connection back to the pool
                        if (err) return resolve(`${err.message}`)
                        resolve(true)
                    })
                })
            } catch (err) {
                if (err instanceof Error) 
                    return resolve(`Error in getConnection: ${err.message}`)
                resolve(`Error in getConnection: ${err}`)
            } finally {
                clearTimeout(timeout)
            }
            return
        })
    }
}
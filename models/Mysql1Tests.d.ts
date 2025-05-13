import mysql from 'mysql';
export declare class Mysql1Tests {
    static isConnectionAlive(mysql1handle: mysql.Connection, timeoutSeconds?: number): Promise<boolean | string>;
    static isPoolAlive(mysql1pool: mysql.Pool, timeoutSeconds?: number): Promise<boolean | string>;
}
//# sourceMappingURL=Mysql1Tests.d.ts.map
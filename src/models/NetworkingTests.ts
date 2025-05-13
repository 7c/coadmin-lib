import * as net from 'net';

export class NetworkingTests {
    static async isTCPPortListening(port: number, ip: string = '127.0.0.1'): Promise<boolean | string> {
        return new Promise(async (resolve, reject) => {
            // Validate IP address
            if (net.isIP(ip) === 0) {
                return resolve('Invalid IP address');
            }

            const server = net.createServer();
            let checkPort: Promise<boolean | string> = new Promise((resolveInner, reject) => {
                server.on('error', (err) => {
                    if (err.message.includes('EADDRINUSE'))
                        resolveInner(true)
                    // any error should raise problem
                    resolveInner(`error: ${err.message}`)
                })
                server.on('listening', () => {
                    resolveInner(false)
                })
            })

            server.listen(port, ip);
            let res = await checkPort

            let to = setTimeout(() => {
                return resolve(res)
            }, 1000)
            server.on('close', () => {
                clearTimeout(to)
                return resolve(res)
            })
            server.close()
            return
        });
    }
}

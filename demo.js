const { CoadminService } = require('./index.js')
const Service1 = new (require('./models/CoadminService2.js'))("demoApp", {
    name: 'worker1',
    version: '1.0.0',
    description: 'pulls data from api1 and saves it to mysql2',
    minInterval: 10,
    maxInterval: 60,
})


function wait(seconds = 1) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, seconds * 1000)
    })
}

function CoadminWorker(fn, ...args) {
    fn(...args)
}

async function worker1() {
    Service1.start()
    while (true) {
        console.log('worker1')
        await wait(1)
        Service1.ping()
    }
    Service1.stop()
}


async function start() {
    try {
        CoadminWorker(worker1)


    } catch (err) {
        console.log(err)
    }
}

start()
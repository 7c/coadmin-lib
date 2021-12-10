const { CoadminService } = require('./index.js')
const coadmin_service = new CoadminService('demo',{
    folder:'/tmp',
    ping:true
})

function wait(seconds=1){
    return new Promise((resolve,reject)=>{
      setTimeout(resolve,seconds*1000)  
    })
}

async function start() {
    try {
        coadmin_service.report('started',false,true)
        await wait(3)
        coadmin_service.report('end',false,true)

    } catch(err) {
        console.log(err)
    }
}

start()
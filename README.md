# Coadmin Project Libraries

## CoadminService Class
```
const { CoadminService } = require('coadmin-lib')
const coadmin_service = new CoadminService('ServiceName')

coadmin_service.report('started')
while(true) {
    coadmin_service.report_every(1,'loop',false,true)
}
coadmin_service.report('finished')
coadmin_service.report_error('exception')
```

## typescript
```
import { ReportIssues } from 'coadmin-lib'

// live mode
const riLive = new ReportIssues('demoLive',{
        live: true,
        server: 'http://127.0.0.1:9091/api',
        server_path: '/socket2.io',
        output: true
})
riLive.warning('test warning')

// passive mode
const riPassive = new ReportIssues('demoPassive',{live: false, folder: '/var/coadmin'})
riPassive.warning('test warning')
```


## ReportIssues Class
use description to describe the issue but without using too many variables inside the description, you can put extra parameters as json, third parameter is for options: 'expireAfter' (in minutes)

```
const ReportIssues = new (require('coadmin-lib').ReportIssues)('AppName')
``
ReportIssues.info('info level description',{extra:'extra info'})
ReportIssues.warning('warn level description',{extra:'extra info'},{ expireAfter:10 })
ReportIssues.fatal('fatal level description',{extra:'extra info'})
ReportIssues.error('error level description',{extra:'extra info'})
```


### Tests.Networking Class

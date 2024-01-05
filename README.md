# Coadmin Project Libraries

## CoadminService Class
```
const { CoadminService } = require('coadmin-lib')
const coadmin_service = new CoadminService('Software1')

coadmin_service.report('started')
while(true) {
    coadmin_service.report_every(1,'loop',false,true)
}
coadmin_service.report('finished')
coadmin_service.report_error('exception')
```


## ReportIssues Class
use description to describe the issue but without using too many variables inside the description, you can put extra parameters as json
```
const ReportIssues = new (require('coadmin-lib').ReportIssues)('AppName')
``
ReportIssues.info('info level description',{extra:'extra info'})
ReportIssues.warn('warn level description',{extra:'extra info'})
ReportIssues.fatal('fatal level description',{extra:'extra info'})
ReportIssues.error('error level description',{extra:'extra info'})
```


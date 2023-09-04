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

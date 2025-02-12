const debug = require('debug')('🟡 '); debug.enabled=true
const debug2 = require('debug')('🔴 '); debug2.enabled=true
function customLogger(...messages) {
  debug(...messages)
}

function customLogger2(...messages) {
  debug2(...messages)
}


global.console.log = (...messages) => customLogger(...messages);
global.console.error = (...messages) => customLogger2(...messages, '⚫️');

beforeAll(() => {
  // console.log('global beforeAll')
})
async function start() {
  return await Promise.resolve('asunc is working')
}

start().then(console.log)

class Util {
  static id = Date.now()
}

console.log('Util.id: ', Util.id)

const unused = 42

import('lodash').then(_ => {
  console.log('_.random(0, 42, true): ', _.random(0, 42, true))
})
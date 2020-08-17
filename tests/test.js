const test = require('ava')
const josa = require('..')

test('placeholder', t => {
  t.is(josa(), 'Hello, world!')
})

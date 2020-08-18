import test from 'ava'
import josa from '..'

test('placeholder', (t) => {
  t.is(josa(), 'Hello, world!')
})

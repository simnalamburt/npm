import assert from 'assert'

import { josa, 은, 는, 을, 를, 와, 과, 이, 가, 로, 으로 } from '..'

it('basic tests', () => {
  const player = '지현'
  const skill = '구르기'
  assert.equal(
    josa`${player}${는} ${skill}${을} 사용했다!`,
    '지현은 구르기를 사용했다!'
  )

  const fruit = '파인애플'
  const apple = '사과'
  assert.equal(
    josa`${fruit}${와} ${apple}${이} 잘 썰려있다.`,
    '파인애플과 사과가 잘 썰려있다.'
  )

  const dr_kim = '김 박사'
  const paper = '논문'
  assert.equal(
    josa`${dr_kim}${은} ${paper}${를} 제출했다.`,
    '김 박사는 논문을 제출했다.'
  )

  const christian = '기독교도'
  const buddhist = '불교인'
  assert.equal(
    josa`${christian}${과} ${buddhist}${가} 화합하는 사회`,
    '기독교도와 불교인이 화합하는 사회'
  )

  const language = '파이썬'
  const spring = '스프링 프레임워크'
  assert.equal(
    josa`${language}${로} 헬로월드 짤 줄 안다고 ${spring}${으로}도 서비스를 개발할 줄 아는건 아니다`,
    '파이썬으로 헬로월드 짤 줄 안다고 스프링 프레임워크로도 서비스를 개발할 줄 아는건 아니다'
  )
})

it('-ㄹ로', () => {
  const skill = '스킬'
  assert.equal(
    josa`${skill}${로} 적을 공격하세요`,
    '스킬로 적을 공격하세요'
  )
})

it('ignore null input', () => {
  assert.equal(josa`Hello, ${undefined}world!`, 'Hello, world!')
  assert.equal(josa`Hello, ${null}world!`, 'Hello, world!')
})

it('empty input', () => {
  assert.equal(josa``, '')
  assert.equal(josa`${undefined}`, '')
  assert.equal(josa`${null}`, '')
})

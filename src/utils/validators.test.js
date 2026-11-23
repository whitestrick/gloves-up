import { describe, it, expect } from 'vitest'
import { validateEmail, validatePassword, validateRoutine } from './validators'

describe('validateEmail', () => {
  it('asks for an email when it is empty or only spaces', () => {
    expect(validateEmail('')).toBe('Enter your email.')
    expect(validateEmail('   ')).toBe('Enter your email.')
  })

  it.each(['abc', 'a@b', 'a b@c.com', '@c.com'])('rejects "%s"', (email) => {
    expect(validateEmail(email)).toBe('Enter a valid email address.')
  })

  it('accepts a normal email, even with spaces around it', () => {
    expect(validateEmail('you@email.com')).toBe('')
    expect(validateEmail('  you@email.com  ')).toBe('')
  })
})

describe('validatePassword', () => {
  it('asks for a password when empty', () => {
    expect(validatePassword('')).toBe('Enter a password.')
  })

  it('rejects fewer than 8 characters', () => {
    expect(validatePassword('1234567')).toBe('Password must be at least 8 characters.')
  })

  it('accepts exactly 8 characters', () => {
    expect(validatePassword('12345678')).toBe('')
  })
})

describe('validateRoutine', () => {
  // A routine that passes every rule. Each test below breaks ONE thing.
  const valid = { name: 'Cardio', rounds: 3, roundSeconds: 180, restSeconds: 60, drillIds: ['jab'] }

  it('returns an empty object when everything is valid', () => {
    expect(validateRoutine(valid)).toEqual({})
  })

  it('needs a name of 1 to 40 characters', () => {
    expect(validateRoutine({ ...valid, name: '  ' }).name).toBe('Give your routine a name.')
    expect(validateRoutine({ ...valid, name: 'x'.repeat(41) }).name).toBe(
      'Name must be 40 characters or less.',
    )
    expect(validateRoutine({ ...valid, name: 'x'.repeat(40) })).toEqual({})
  })

  it.each([0, 21, 2.5, 'abc'])('rejects rounds = %s', (rounds) => {
    expect(validateRoutine({ ...valid, rounds }).rounds).toBe(
      'Rounds must be a whole number from 1 to 20.',
    )
  })

  it.each([1, 20, '5'])('accepts rounds = %s', (rounds) => {
    expect(validateRoutine({ ...valid, rounds })).toEqual({})
  })

  it.each([9, 601])('rejects round length = %s', (roundSeconds) => {
    expect(validateRoutine({ ...valid, roundSeconds }).roundSeconds).toBe(
      'Round length must be 10 to 600 seconds.',
    )
  })

  it.each([10, 600])('accepts round length = %s', (roundSeconds) => {
    expect(validateRoutine({ ...valid, roundSeconds })).toEqual({})
  })

  it.each([-1, 301])('rejects rest = %s', (restSeconds) => {
    expect(validateRoutine({ ...valid, restSeconds }).restSeconds).toBe(
      'Rest must be 0 to 300 seconds.',
    )
  })

  it.each([0, 300])('accepts rest = %s', (restSeconds) => {
    expect(validateRoutine({ ...valid, restSeconds })).toEqual({})
  })

  it('needs at least one drill', () => {
    expect(validateRoutine({ ...valid, drillIds: [] }).drillIds).toBe('Add at least one drill.')
  })

  it('reports every problem at once', () => {
    const errors = validateRoutine({
      name: '',
      rounds: 0,
      roundSeconds: 1,
      restSeconds: -5,
      drillIds: [],
    })
    expect(Object.keys(errors)).toEqual(['name', 'rounds', 'roundSeconds', 'restSeconds', 'drillIds'])
  })
})

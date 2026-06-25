import type { TFunction } from 'i18next'
import identity from 'lodash/identity'
import { vi } from 'vitest'
import { emailRegex, mapValidationErrorMessages, withTrimmedRequired } from '../form.utils'

const tMock = identity as unknown as TFunction

describe('mapValidationErrorMessages validation utility function testing', () => {
  it('should handle required rule correctly when set with a boolean', () => {
    const result = mapValidationErrorMessages({ required: true }, tMock)
    expect(result).toEqual({ required: 'validation.mixed.required' })
  })

  it('should handle required rule correctly when set with an object', () => {
    const requiredRule = { required: { value: true, message: 'test' } }
    const result = mapValidationErrorMessages(requiredRule, tMock)
    expect(result).toEqual(requiredRule)
  })

  it('should handle min rule correctly when set with custom message', () => {
    const requiredRule = { min: { value: 10, message: 'test' } }
    const result = mapValidationErrorMessages(requiredRule, tMock)
    expect(result).toEqual(requiredRule)
  })

  it('should handle min rule correctly when set without custom message', () => {
    const requiredRule = { min: 10 }
    const result = mapValidationErrorMessages(requiredRule, tMock)
    expect(result).toEqual({
      min: {
        message: 'validation.number.min',
        value: 10,
      },
    })
  })

  it('should handle max rule correctly when set with custom message', () => {
    const requiredRule = { max: { value: 10, message: 'test' } }
    const result = mapValidationErrorMessages(requiredRule, tMock)
    expect(result).toEqual(requiredRule)
  })

  it('should handle max rule correctly when set without custom message', () => {
    const requiredRule = { max: 10 }
    const result = mapValidationErrorMessages(requiredRule, tMock)
    expect(result).toEqual({
      max: {
        message: 'validation.number.max',
        value: 10,
      },
    })
  })

  it('should handle minLength rule correctly when set with custom message', () => {
    const requiredRule = { minLength: { value: 10, message: 'test' } }
    const result = mapValidationErrorMessages(requiredRule, tMock)
    expect(result).toEqual(requiredRule)
  })

  it('should handle minLength rule correctly when set without custom message', () => {
    const requiredRule = { minLength: 10 }
    const result = mapValidationErrorMessages(requiredRule, tMock)
    expect(result).toEqual({
      minLength: {
        message: 'validation.string.minLength',
        value: 10,
      },
    })
  })

  it('should not set default message to maxLength rule', () => {
    const requiredRule = { maxLength: 10 }
    const result = mapValidationErrorMessages(requiredRule, tMock)
    expect(result).toEqual({
      maxLength: 10,
    })
  })

  it('should not set default message to pattern rule', () => {
    const requiredRule = { pattern: /regex/ }
    const result = mapValidationErrorMessages(requiredRule, tMock)
    expect(result).toEqual({
      pattern: /regex/,
    })
  })
})

describe('withTrimmedRequired validation utility function testing', () => {
  it('returns the rules unchanged when there is no required rule', () => {
    expect(withTrimmedRequired({ minLength: 5 }, tMock)).toEqual({ minLength: 5 })
  })

  it('returns undefined rules unchanged', () => {
    expect(withTrimmedRequired(undefined, tMock)).toBeUndefined()
  })

  it('adds a validate that rejects whitespace-only and empty strings', () => {
    const result = withTrimmedRequired({ required: true }, tMock)
    const validate = result?.validate as (value: unknown) => true | string
    expect(validate('   ')).toBe('validation.mixed.required')
    expect(validate('')).toBe('validation.mixed.required')
    expect(validate('\n\t ')).toBe('validation.mixed.required')
  })

  it('lets non-blank strings and non-string values pass', () => {
    const result = withTrimmedRequired({ required: true }, tMock)
    const validate = result?.validate as (value: unknown) => true | string
    expect(validate('hello')).toBe(true)
    expect(validate('  hello  ')).toBe(true)
    expect(validate(42)).toBe(true)
    expect(validate(undefined)).toBe(true)
  })

  it('preserves a custom required message', () => {
    const result = withTrimmedRequired({ required: { value: true, message: 'custom' } }, tMock)
    const validate = result?.validate as (value: unknown) => true | string
    expect(validate('   ')).toBe('custom')
  })

  it('merges with an existing validate function', () => {
    const existing = vi.fn(() => true)
    const result = withTrimmedRequired({ required: true, validate: existing }, tMock)
    expect(result?.validate).toEqual({ existing, notBlank: expect.any(Function) })
  })

  it('merges with an existing validate object', () => {
    const custom = () => true
    const result = withTrimmedRequired({ required: true, validate: { custom } }, tMock)
    expect(result?.validate).toEqual({ custom, notBlank: expect.any(Function) })
  })
})

describe('testing email validation regex', () => {
  it('should correctly test emails', () => {
    const emails: Array<{ email: string; expectedResult: boolean }> = [
      { email: 'a@b.it', expectedResult: true },
      { email: '@b.it', expectedResult: false },
      { email: 'a.mario@rossi.it', expectedResult: true },
      { email: 'mario', expectedResult: false },
    ]

    emails.forEach(({ email, expectedResult }) => {
      expect(emailRegex.test(email)).toBe(expectedResult)
    })
  })
})

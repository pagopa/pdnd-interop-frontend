import mapValues from 'lodash/mapValues'
import type { ControllerProps } from 'react-hook-form'
import type { TFunction } from 'i18next'

// Taken from HTML spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
export const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export const mapValidationErrorMessages = (
  rules: ControllerProps['rules'],
  t: TFunction
): ControllerProps['rules'] => {
  const mappedRules = mapValues(rules, (value, key) => {
    switch (key) {
      case 'required':
        if (typeof value === 'boolean') {
          return t('validation.mixed.required')
        }
        return value
      case 'min':
        if (value.message) {
          return value
        }
        return {
          value: value,
          message: t('validation.number.min', { min: value }),
        }
      case 'max':
        if (value.message) {
          return value
        }
        return {
          value: value,
          message: t('validation.number.max', { max: value }),
        }
      case 'minLength':
        if (value.message) {
          return value
        }
        return {
          value: value,
          message: t('validation.string.minLength', { min: value }),
        }
      case 'maxLength':
      // There should be no need for a maxLength default validation message since the maxLenght constraint
      // is imposed by the browser blocking the user writing more characters than the numbers allowed
      case 'pattern':
      // The pattern rule takes regex and is too generic too have a specific default message
      default:
        return value
    }
  })

  return mappedRules
}

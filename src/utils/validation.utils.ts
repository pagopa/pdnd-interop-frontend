import mapValues from 'lodash/mapValues'
import { ControllerProps } from 'react-hook-form'
import { TFunction } from 'i18next'

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
      case 'maxLength':
        if (value.message) {
          return value
        }
        return {
          value: value,
          message: 'TODO Messaggio di errore per il maxLength',
        }
      case 'minLength':
        if (value.message) {
          return value
        }
        return {
          value: value,
          message: t('validation.string.minLength', { min: value }),
        }
      case 'pattern':
        if (value.message) {
          return value
        }
        return {
          value: value,
          message: 'TODO Messaggio di errore di default per il pattern se serve metterlo',
        }
      default:
        return value
    }
  })

  return mappedRules
}

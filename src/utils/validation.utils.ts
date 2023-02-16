import mapValues from 'lodash/mapValues'
import { ControllerProps } from 'react-hook-form'
import { TFunction } from 'i18next'

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
          message: t('validation.number.min'),
        }
      case 'max':
        if (value.message) {
          return value
        }
        return {
          value: value,
          message: t('validation.number.max'),
        }
      case 'maxLength':
        if (value.message) {
          return value
        }
        return {
          value: value,
          message: 'Messaggio di errore per il maxLength',
        }
      case 'minLength':
        if (value.message) {
          return value
        }
        return {
          value: value,
          message: 'Messaggio di errore per il minLength',
        }
      case 'pattern':
        if (value.message) {
          return value
        }
        return {
          value: value,
          message: 'Messaggio di errore per il pattern',
        }
      default:
        return value
    }
  })

  return mappedRules
}

// export const mapValidationErrorMessages = (
//   rules: ControllerProps['rules'],
//   t: TFunction
// ): ControllerProps['rules'] => {
//   const mappedRules = mapValues(rules, (value, key) => {
//     if (key === 'required') {
//       if (typeof value === 'boolean') return t('validation.mixed.required')
//       return value
//     }

//     const defaultMessages = {
//       min: t('validation.number.min'),
//       max: t('validation.number.max'),
//       maxLength: t('validation.number.maxLength'),
//       minLength: t('validation.number.minLength'),
//       pattern: t('validation.number.pattern'),
//       validate: t('validation.number.validate'),
//     }

//     if (!('message' in value) && key in defaultMessages) {
//       return { value, message: defaultMessages[key as keyof typeof defaultMessages] }
//     }

//     return value
//   })

//   return mappedRules
// }

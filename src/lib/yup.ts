import { TFunction } from 'i18next'
import * as appYup from 'yup'

export function buildYupLocale(_: unknown, t: TFunction): void {
  appYup.setLocale({
    mixed: {
      required: t('validation.mixed.required'),
    },
    number: {
      min: t('validation.number.min'),
      max: t('validation.number.max'),
    },
    string: {
      email: t('validation.string.email'),
    },
  })
}

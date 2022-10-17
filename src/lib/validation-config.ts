import { setLocale } from 'yup'
import { TFunction } from 'i18next'

export const buildLocale = (t: TFunction) => {
  setLocale({
    mixed: { required: t('validation.mixed.required') },
    string: { email: t('validation.string.email') },
    boolean: { isValue: t('validation.boolean.isValue') },
  })
}

export function isTrue(value: boolean | undefined) {
  return Boolean(value)
}

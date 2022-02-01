import { setLocale } from 'yup'

setLocale({
  mixed: {
    required: 'Il campo è obbligatorio',
  },
  string: {
    email: "Il formato dell'indirizzo email non è valido",
  },
})

export function isTrue(value: boolean | undefined) {
  return Boolean(value)
}

import { object, string } from 'yup'

export const userCreationFormInitialValues = { name: '', surname: '', taxCode: '', email: '' }
export const userCreationFormValidationSchema = object({
  name: string().required(),
  surname: string().required(),
  taxCode: string().required(),
  email: string().email().required(),
})
export const userCreationFormContract = { version: '1', path: 'contracts/v1/interop-contract.html' }

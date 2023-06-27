import mapValues from 'lodash/mapValues'
import type { ControllerProps } from 'react-hook-form'
import type { TFunction } from 'i18next'
import type { InputDescriptorKey, InputDescriptors } from '@/types/common.types'

/**
 * Returns the ids and accessibility props for a given input name and input descriptors
 * @param inputName The name of the input
 * @param inputDescriptors The string used to describe the input
 * @returns The ids and accessibility props
 */
export function getAriaAccessibilityInputProps<
  TKey extends InputDescriptorKey,
  TAriaProps extends {
    'aria-invalid'?: 'true' | 'false'
    'aria-labelledby'?: string
    'aria-describedby'?: string
  }
>(
  inputName: string,
  inputDescriptors: InputDescriptors<TKey>
): {
  ids: Record<`${TKey}Id`, string>
  accessibilityProps: TAriaProps
} {
  const ids = Object.keys(inputDescriptors).reduce((acc, key) => {
    const id = `${inputName}-${key}`
    acc[(key + 'Id') as `${TKey}Id`] = id
    return acc
  }, {} as Record<`${TKey}Id`, string>)

  const describedByIds: string[] = []
  const accessibilityProps: Partial<TAriaProps> = {}

  if ('label' in inputDescriptors && 'labelId' in ids && inputDescriptors.label) {
    accessibilityProps['aria-labelledby'] = ids.labelId as string
  }

  if ('error' in inputDescriptors && 'errorId' in ids && inputDescriptors.error) {
    accessibilityProps['aria-invalid'] = 'true'
    describedByIds.push(ids.errorId as string)
  }

  if ('infoLabel' in inputDescriptors && 'infoLabelId' in ids && inputDescriptors.infoLabel) {
    console.log('HERE')
    describedByIds.push(ids.infoLabelId as string)
  }

  if ('helperText' in inputDescriptors && 'helperTextId' in ids && inputDescriptors.helperText) {
    describedByIds.push(ids.helperTextId as string)
  }

  if (describedByIds.length > 0) {
    accessibilityProps['aria-describedby'] = describedByIds.join(' ')
  }

  return { ids, accessibilityProps: accessibilityProps as TAriaProps }
}

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

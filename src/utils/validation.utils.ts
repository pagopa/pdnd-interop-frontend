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
        if (value === true || value === false) {
          return t('validation.mixed.required')
        } else return value
      case 'min':
        if (value.message) {
          return value
        } else {
          return {
            value: value,
            message: t('validation.number.min'),
          }
        }
      case 'max':
        if (value.message) {
          return value
        } else {
          return {
            value: value,
            message: t('validation.number.max'),
          }
        }
      case 'maxLength':
        if (value.message) {
          return value
        } else {
          return {
            value: value,
            message: 'Messaggio di errore per il maxLength',
          }
        }
      case 'minLength':
        if (value.message) {
          return value
        } else {
          return {
            value: value,
            message: 'Messaggio di errore per il minLength',
          }
        }
      case 'pattern':
        if (value.message) {
          return value
        } else {
          return {
            value: value,
            message: 'Messaggio di errore per il pattern',
          }
        }
      case 'validate':
        if (value.message) {
          return value
        } else {
          return {
            value: value,
            message: 'Messaggio di errore per il validate',
          }
        }
      default:
        return
    }
  })

  return mappedRules
}

//     required: Message | ValidationRule<boolean>;
//     min: ValidationRule<number | string>;
//     max: ValidationRule<number | string>;
//     maxLength: ValidationRule<number>;
//     minLength: ValidationRule<number>;
//     pattern: ValidationRule<RegExp>;
//     validate: Validate<FieldPathValue<TFieldValues, TFieldName>, TFieldValues> | Record<string, Validate<FieldPathValue<TFieldValues, TFieldName>, TFieldValues>>;
//
//     valueAsNumber: boolean;
//     valueAsDate: boolean;
//     value: FieldPathValue<TFieldValues, TFieldName>;
//     setValueAs: (value: any) => any;
//     shouldUnregister?: boolean;
//     onChange?: (event: any) => void;
//     onBlur?: (event: any) => void;
//     disabled: boolean;
//     deps: InternalFieldName | InternalFieldName[];

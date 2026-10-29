import React from 'react'
import { InputWrapper } from '../InputWrapper'
import it from 'date-fns/locale/it'
import en from 'date-fns/locale/en-US'
import { useFormContext, Controller, type FieldValues, type FieldErrors } from 'react-hook-form'
import type { ControllerProps } from 'react-hook-form/dist/types/controller'
import { mapValidationErrorMessages, withTrimmedRequired } from '@/utils/form.utils'
import { useTranslation } from 'react-i18next'
import get from 'lodash/get'
import {
  type DatePickerProps,
  DatePicker as MUIDatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'

export type RHFDatePickerProps = DatePickerProps<Date> & {
  name: string
  indexFieldArray?: number
  fieldArrayKeyName?: string
  infoLabel?: React.ReactNode
  focusOnMount?: boolean
  rules?: ControllerProps['rules']
}

export const RHFDatePicker: React.FC<RHFDatePickerProps> = ({
  sx,
  name,
  label,
  infoLabel,
  rules,
  indexFieldArray,
  focusOnMount,
  fieldArrayKeyName,

  ...props
}) => {
  const { formState } = useFormContext()
  const { t } = useTranslation()
  const lang = useCurrentLanguage()

  const error = getErrors(indexFieldArray, fieldArrayKeyName, formState.errors, name)
  const fieldName =
    indexFieldArray !== undefined ? `${name}.${indexFieldArray}.${fieldArrayKeyName}` : name

  const adapterLocale = { it, en }[lang]

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale}>
      <InputWrapper error={error} sx={sx} infoLabel={infoLabel}>
        <Controller
          name={fieldName}
          disabled={props.disabled}
          rules={withTrimmedRequired(mapValidationErrorMessages(rules, t), t)}
          render={({ field: { ref, onChange: _onChange, ...fieldProps } }) => (
            <MUIDatePicker
              {...props}
              autoFocus={focusOnMount}
              label={label}
              onChange={(value) => {
                _onChange(value)
              }}
              inputRef={ref}
              {...fieldProps}
            />
          )}
        />
      </InputWrapper>
    </LocalizationProvider>
  )
}

const getErrors = (
  indexFieldArray: number | undefined,
  fieldArrayKeyName: string | undefined,
  errors: FieldErrors<FieldValues>,
  name: string
): string | undefined => {
  if (indexFieldArray !== undefined && fieldArrayKeyName) {
    // If indexFieldArray and fieldArrayKeyName are provided, means that we're working with fieldArray and we need to handling errors in a different way
    const err = errors[name] as Array<Record<string, { message?: string }>> | undefined
    return err?.[indexFieldArray]?.[fieldArrayKeyName]?.message as string | undefined
  }

  const directError = errors[name]?.message as string | undefined
  if (directError) {
    return directError
  }

  if (name.includes('.')) {
    const nestedError = get(errors, name) as { message?: string } | undefined
    return nestedError?.message
  }

  return undefined
}

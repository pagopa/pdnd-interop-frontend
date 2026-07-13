import React from 'react'
import { TextField as MUITextField, type TextFieldProps as MUITextFieldProps } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import { InputWrapper } from '../InputWrapper'
import type { FieldErrors, FieldValues } from 'react-hook-form'
import { useFormContext, Controller } from 'react-hook-form'
import type { ControllerProps } from 'react-hook-form/dist/types/controller'
import {
  getAriaAccessibilityInputProps,
  mapValidationErrorMessages,
  withTrimmedRequired,
} from '@/utils/form.utils'
import { useTranslation } from 'react-i18next'
import get from 'lodash/get'

export type RHFTextFieldProps = Omit<MUITextFieldProps, 'type' | 'label'> & {
  name: string
  indexFieldArray?: number
  fieldArrayKeyName?: string
  label: string
  labelType?: 'external' | 'shrink'
  infoLabel?: React.ReactNode
  focusOnMount?: boolean
  rules?: ControllerProps['rules']
} & (
    | {
        type?: 'text' | 'email'
        integerOnly?: never
        onValueChange?: (value: string) => void
      }
    | {
        type?: 'number'
        integerOnly?: boolean
        onValueChange?: (value: number) => void
      }
  )

export const RHFTextField: React.FC<RHFTextFieldProps> = ({
  sx,
  name,
  label,
  labelType = 'shrink',
  infoLabel,
  focusOnMount,
  multiline,
  integerOnly = false,
  onValueChange,
  rules,
  size = 'small',
  rows,
  indexFieldArray,
  fieldArrayKeyName,
  ...props
}) => {
  const { formState } = useFormContext()
  const { t } = useTranslation()

  const error = getErrors(indexFieldArray, fieldArrayKeyName, formState.errors, name)

  const fieldName =
    indexFieldArray !== undefined ? `${name}.${indexFieldArray}.${fieldArrayKeyName}` : name

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(fieldName, {
    infoLabel,
    error,
  })

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel} {...ids}>
      <Controller
        name={fieldName}
        rules={withTrimmedRequired(mapValidationErrorMessages(rules, t), t)}
        render={({ field: { ref, onChange: _onChange, ...fieldProps } }) => (
          <MUITextField
            autoFocus={focusOnMount}
            id={fieldName}
            size={size}
            label={label}
            inputProps={{ ...props.inputProps, ...accessibilityProps }}
            multiline={multiline}
            rows={multiline && !rows ? 2.5 : rows}
            error={!!error}
            sx={{
              '& .MuiFormLabel-asterisk': {
                color: props.required ? theme.palette.error.dark : 'inherit',
              },
            }}
            InputLabelProps={
              labelType === 'external'
                ? {
                    shrink: false,
                    sx: {
                      position: 'static',
                      transform: 'none',
                      color: 'inherit',
                      mb: 1.25,
                      pointerEvents: 'auto',
                    },
                  }
                : undefined
            }
            // Block non-numeric keys and leading zeros for number inputs.
            // e.key.length === 1 targets printable characters only;
            // control keys (Backspace, Tab, Arrow*, etc.) have longer names and pass through.
            onKeyDown={
              props.type === 'number'
                ? (e) => {
                    if (e.key.length !== 1 || e.ctrlKey || e.metaKey) return
                    const isEmpty = (e.target as HTMLInputElement).value === ''
                    const allowedCharacters = integerOnly ? /[1-9\-]/ : /[1-9.\-]/
                    if (!allowedCharacters.test(e.key) && !(e.key === '0' && !isEmpty)) {
                      e.preventDefault()
                    }
                  }
                : undefined
            }
            onChange={(e) => {
              let value: string | number = e.target.value
              if (props.type === 'number') {
                const valueAsNumber = Number(e.target.value)
                value = e.target.value === '' ? '' : isNaN(valueAsNumber) ? '' : valueAsNumber
              }
              _onChange(value)
              if (onValueChange) onValueChange(value as never)
            }}
            inputRef={ref}
            {...fieldProps}
            {...props}
          />
        )}
      />
    </InputWrapper>
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

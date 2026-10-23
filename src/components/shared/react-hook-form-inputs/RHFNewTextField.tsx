import React from 'react'
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
import { type MITextFieldProps, MITextField } from '@pagopa/mui-italia'

export type RHFNewTextFieldProps = Omit<MITextFieldProps, 'type' | 'label'> & {
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
        onValueChange?: (value: string) => void
      }
    | {
        type?: 'number'
        onValueChange?: (value: number | '') => void
      }
  )

export const RHFNewTextField: React.FC<RHFNewTextFieldProps> = ({
  sx,
  name,
  label,
  labelType = 'shrink',
  infoLabel,
  focusOnMount,
  multiline,
  onValueChange,
  rules,
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
        disabled={props.disabled}
        rules={withTrimmedRequired(mapValidationErrorMessages(rules, t), t)}
        render={({ field: { ref, onChange: _onChange, ...fieldProps } }) => (
          <MITextField
            {...props}
            autoFocus={focusOnMount}
            id={fieldName}
            label={label}
            inputProps={{ ...props.inputProps, ...accessibilityProps }}
            multiline={multiline}
            rows={multiline && !rows ? 2.5 : rows}
            error={!!error}
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
                    if (!/[1-9.\-]/.test(e.key) && !(e.key === '0' && !isEmpty)) {
                      e.preventDefault()
                    }
                  }
                : props.onKeyDown
            }
            onChange={(e) => {
              let value: string | number = e.target.value
              if (props.type === 'number') {
                const valueAsNumber = Number(e.target.value)
                value = e.target.value === '' ? '' : isNaN(valueAsNumber) ? '' : valueAsNumber
              }
              _onChange(value)
              props.onChange?.(e)
              if (onValueChange) onValueChange(value as never)
            }}
            inputRef={ref}
            {...fieldProps}
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

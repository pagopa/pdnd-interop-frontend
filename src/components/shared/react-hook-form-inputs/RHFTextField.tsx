import React from 'react'
import { TextField as MUITextField, type TextFieldProps as MUITextFieldProps } from '@mui/material'
import { InputWrapper } from '../InputWrapper'
import { useFormContext, Controller } from 'react-hook-form'
import type { ControllerProps } from 'react-hook-form/dist/types/controller'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import { useTranslation } from 'react-i18next'

export type RHFTextFieldProps = Omit<MUITextFieldProps, 'type' | 'label'> & {
  name: string
  label: string
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
        onValueChange?: (value: number) => void
      }
  )

export const RHFTextField: React.FC<RHFTextFieldProps> = ({
  sx,
  name,
  label,
  infoLabel,
  focusOnMount,
  multiline,
  onValueChange,
  rules,
  ...props
}) => {
  const { formState } = useFormContext()
  const { t } = useTranslation()

  const error = formState.errors[name]?.message as string | undefined

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    infoLabel,
    error,
  })

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel} {...ids}>
      <Controller
        name={name}
        rules={mapValidationErrorMessages(rules, t)}
        render={({ field: { ref, onChange: _onChange, ...fieldProps } }) => (
          <MUITextField
            autoFocus={focusOnMount}
            {...props}
            label={label}
            inputProps={{ ...props.inputProps, ...accessibilityProps }}
            multiline={multiline}
            rows={multiline ? 2.5 : undefined}
            error={!!error}
            onChange={(e) => {
              let value: string | number = e.target.value
              if (props.type === 'number') {
                const valueAsNumber = Number(e.target.value)
                value = isNaN(valueAsNumber) ? '' : valueAsNumber
              }
              _onChange(value)
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

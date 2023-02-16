import React from 'react'
import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material'
import { InputWrapper } from '../InputWrapper'
import { useFormContext, Controller } from 'react-hook-form'
import { ControllerProps } from 'react-hook-form/dist/types/controller'
import { mapValidationErrorMessages } from '@/utils/validation.utils'
import { useTranslation } from 'react-i18next'

export type StyledInputTextType = 'text' | 'email' | 'number'

export type TextFieldProps = Omit<MUITextFieldProps, 'type'> & {
  name: string
  infoLabel?: string
  focusOnMount?: boolean
  onValueChange?: (value: string) => void
  rules?: ControllerProps['rules']
} & (
    | {
        type?: 'text' | 'email'
        value?: string
      }
    | {
        type?: 'number'
        value?: number
      }
  )

export const TextField: React.FC<TextFieldProps> = ({
  sx,
  name,
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

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel}>
      <Controller
        name={name}
        rules={mapValidationErrorMessages(rules, t)}
        render={({ field: { ref, onChange: _onChange, ...fieldProps } }) => (
          <MUITextField
            autoFocus={focusOnMount}
            {...props}
            multiline={multiline}
            rows={multiline ? 6 : undefined}
            InputLabelProps={{ shrink: true, ...props?.InputLabelProps }}
            error={!!error}
            onChange={(e) => {
              _onChange(e)
              if (onValueChange) onValueChange(e.target.value)
            }}
            inputRef={ref}
            {...fieldProps}
          />
        )}
      />
    </InputWrapper>
  )
}

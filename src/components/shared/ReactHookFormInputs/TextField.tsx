import React from 'react'
import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material'
import { InputWrapper } from '../InputWrapper'
import { useFormContext, Controller } from 'react-hook-form'
import { ControllerProps } from 'react-hook-form/dist/types/controller'

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

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel}>
      <Controller
        name={name}
        rules={rules}
        render={({ field: { onChange: _onChange } }) => (
          <MUITextField
            autoFocus={focusOnMount}
            multiline={multiline}
            rows={multiline ? 6 : undefined}
            InputLabelProps={{ shrink: true, ...props?.InputLabelProps }}
            error={!!error}
            onChange={(e) => {
              _onChange(e)
              if (onValueChange) onValueChange(e.target.value)
            }}
            {...props}
          />
        )}
      />
    </InputWrapper>
  )
}

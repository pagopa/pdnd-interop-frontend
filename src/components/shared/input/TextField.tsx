import React from 'react'
import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material'
import { InputWrapper } from './InputWrapper'
import { useFormContext } from 'react-hook-form'

export type StyledInputTextType = 'text' | 'email' | 'number'

export type TextFieldProps = Omit<MUITextFieldProps, 'type'> & {
  name: string
  infoLabel?: string
  focusOnMount?: boolean
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
  ...props
}) => {
  const { register, formState } = useFormContext()

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      <MUITextField autoFocus={focusOnMount} {...props} error={!!error} {...register(name)} />
    </InputWrapper>
  )
}

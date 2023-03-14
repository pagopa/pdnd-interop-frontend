import React from 'react'
import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material'
import { InputWrapper } from '../InputWrapper'
import { useFormContext, Controller } from 'react-hook-form'
import { ControllerProps } from 'react-hook-form/dist/types/controller'
import { mapValidationErrorMessages } from '@/utils/validation.utils'
import { useTranslation } from 'react-i18next'

export type RHFTextFieldProps = Omit<MUITextFieldProps, 'type'> & {
  name: string
  infoLabel?: string
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
              let value: string | number = e.target.value
              if (props.type === 'number') {
                const valueAsNumber = parseInt(e.target.value, 10)
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

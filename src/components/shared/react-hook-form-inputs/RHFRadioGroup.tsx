import React, { useId } from 'react'
import {
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup as MUIRadioGroup,
  type RadioGroupProps as MUIRadioGroupProps,
} from '@mui/material'
import { InputWrapper } from '../InputWrapper'
import { Controller, useFormContext } from 'react-hook-form'
import type { InputRadioGroupOption } from '@/types/common.types'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { mapValidationErrorMessages } from '@/utils/form.utils'

export type RHFRadioGroupProps = Omit<MUIRadioGroupProps, 'onChange'> & {
  label?: string | JSX.Element
  options: Array<InputRadioGroupOption & { disabled?: boolean }>
  name: string
  infoLabel?: string
  disabled?: boolean
  required?: boolean
  rules?: ControllerProps['rules']
  onValueChange?: (value: string) => void
  isOptionValueAsBoolean?: boolean
}

export const RHFRadioGroup: React.FC<RHFRadioGroupProps> = ({
  sx,
  name,
  label,
  options,
  infoLabel,
  disabled,
  required,
  rules,
  onValueChange,
  isOptionValueAsBoolean = false,
  ...props
}) => {
  const { formState } = useFormContext()
  const labelId = useId()
  const { t } = useTranslation()

  if (!options || options.length === 0) {
    return null
  }

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel}>
      {label && (
        <FormLabel sx={{ fontWeight: 600, mb: props.row ? 1 : 0 }} id={labelId} required={required}>
          {label}
        </FormLabel>
      )}
      <Controller
        name={name}
        rules={mapValidationErrorMessages(rules, t)}
        render={({ field: { onChange, ...fieldProps } }) => (
          <MUIRadioGroup
            aria-labelledby={labelId}
            {...props}
            {...fieldProps}
            onChange={(_, val) => {
              let value: string | boolean = val
              if (isOptionValueAsBoolean) {
                if (val === 'true') {
                  value = true
                } else if (val === 'false') {
                  value = false
                }
              }
              if (onValueChange) onValueChange(val)
              onChange(value)
            }}
          >
            {options.map((o) => (
              <FormControlLabel
                disabled={disabled || o.disabled}
                key={`${labelId}-${o.value}`}
                value={o.value}
                control={<Radio />}
                label={o.label}
                sx={{ mr: 3 }}
              />
            ))}
          </MUIRadioGroup>
        )}
      />
    </InputWrapper>
  )
}

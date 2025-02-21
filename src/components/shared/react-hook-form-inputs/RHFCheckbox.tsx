import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import React from 'react'
import { Controller, useFormContext, type ControllerProps } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { InputWrapper } from '../InputWrapper'
import {
  Checkbox as MUICheckbox,
  FormControlLabel,
  type CheckboxProps as MUICheckboxProps,
} from '@mui/material'

type RHFCheckboxProps = Omit<MUICheckboxProps, 'checked' | 'onChange'> & {
  name: string
  label: React.ReactNode
  infoLabel?: React.ReactNode
  rules?: ControllerProps['rules']
}

export const RHFCheckbox: React.FC<RHFCheckboxProps> = ({ name, label, infoLabel, rules, sx }) => {
  const { formState } = useFormContext()
  const { t } = useTranslation()

  const error = formState.errors[name]?.message as string | undefined

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    label,
    infoLabel,
    error,
  })

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel} {...ids}>
      <Controller
        name={name}
        rules={mapValidationErrorMessages(rules, t)}
        render={({ field: { value, ref, ...fieldProps } }) => (
          <FormControlLabel
            label={label}
            control={
              <MUICheckbox
                {...fieldProps}
                inputProps={{ ...accessibilityProps }}
                inputRef={ref}
                checked={value}
              />
            }
          />
        )}
      />
    </InputWrapper>
  )
}

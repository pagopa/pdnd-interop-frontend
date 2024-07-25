import { InputWrapper } from '../InputWrapper'
import React from 'react'
import {
  Switch as MUISwitch,
  type SwitchProps as MUISwitchProps,
  FormControlLabel,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'

export type RHFSwitchProps = Omit<MUISwitchProps, 'checked' | 'onChange'> & {
  label: string
  infoLabel?: string
  name: string
  rules?: ControllerProps['rules']
}

export const RHFSwitch: React.FC<RHFSwitchProps> = ({
  label,
  infoLabel,
  name,
  sx,
  rules,
  ...props
}) => {
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
            control={
              <MUISwitch
                {...props}
                {...fieldProps}
                inputProps={{ ...props.inputProps, ...accessibilityProps }}
                checked={value}
                inputRef={ref}
              />
            }
            label={label}
          />
        )}
      />
    </InputWrapper>
  )
}

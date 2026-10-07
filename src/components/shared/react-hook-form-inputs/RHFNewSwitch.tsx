import { InputWrapper } from '../InputWrapper'
import React from 'react'
import { type SwitchProps as MUISwitchProps, FormControlLabel } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import { MISwitch } from '@pagopa/mui-italia/components/MISwitch'

export type RHFNewSwitchProps = Omit<MUISwitchProps, 'checked' | 'onChange'> & {
  label: string | React.ReactNode
  infoLabel?: string
  name: string
  rules?: ControllerProps['rules']
}

export const RHFNewSwitch: React.FC<RHFNewSwitchProps> = ({
  label,
  infoLabel,
  name,
  sx,
  rules,
  disabled,
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
              <MISwitch
                {...props}
                {...fieldProps}
                disabled={disabled}
                inputProps={{ ...props.inputProps, ...accessibilityProps }}
                checked={value}
                inputRef={ref}
                sx={{ marginRight: 1 }}
              />
            }
            label={label}
            componentsProps={{ typography: { id: ids.labelId } }}
          />
        )}
      />
    </InputWrapper>
  )
}

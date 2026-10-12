import React from 'react'
import { FormControl, type SwitchProps as MUISwitchProps } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { mapValidationErrorMessages } from '@/utils/form.utils'
import { MISwitch } from '@pagopa/mui-italia'

export type RHFNewSwitchProps = Omit<MUISwitchProps, 'checked' | 'onChange'> & {
  label: string
  description?: string
  name: string
  rules?: ControllerProps['rules']
}

export const RHFNewSwitch: React.FC<RHFNewSwitchProps> = ({
  label,
  description,
  name,
  sx,
  rules,
  disabled,
  ...props
}) => {
  const { control } = useFormContext()
  const { t } = useTranslation()

  return (
    <Controller
      control={control}
      name={name}
      rules={mapValidationErrorMessages(rules, t)}
      render={({ field: { value, ref, ...fieldProps }, fieldState }) => {
        const error = fieldState.error?.message as string | undefined

        return (
          <FormControl fullWidth sx={{ my: 2, ...sx }}>
            <MISwitch
              label={label as string}
              description={description}
              {...fieldProps}
              disabled={disabled}
              inputProps={props.inputProps}
              checked={value}
              inputRef={ref}
              sx={{ marginRight: 1 }}
              {...props}
              error={error}
            />
          </FormControl>
        )
      }}
    />
  )
}

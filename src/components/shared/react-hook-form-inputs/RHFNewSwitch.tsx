import React from 'react'
import { FormControl } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { mapValidationErrorMessages } from '@/utils/form.utils'
import type { MISwitchProps } from '@pagopa/mui-italia'
import { MISwitch } from '@pagopa/mui-italia'

export type RHFNewSwitchProps = Omit<MISwitchProps, 'checked' | 'onChange'> & {
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
          <FormControl fullWidth sx={[{ my: 2 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
            <MISwitch
              {...props}
              {...fieldProps}
              label={label as string}
              description={description}
              disabled={disabled}
              inputProps={props.inputProps}
              checked={value}
              inputRef={ref}
              sx={{ marginRight: 1 }}
              error={error}
            />
          </FormControl>
        )
      }}
    />
  )
}

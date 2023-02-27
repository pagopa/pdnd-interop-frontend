import React from 'react'
import { FormLabel, Switch as MUISwitch, Typography, Stack } from '@mui/material'
import type { SwitchProps as MUISwitchProps } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { InputWrapper } from '@/components/shared/InputWrapper'
import { mapValidationErrorMessages } from '@/utils/validation.utils'
import { useTranslation } from 'react-i18next'
import type { ControllerProps } from 'react-hook-form/dist/types'
import type { InputOption } from '@/types/common.types'

type RiskAnalysisSwitchProps = Omit<MUISwitchProps, 'checked' | 'onChange'> & {
  label: string
  infoLabel?: string | JSX.Element
  options: Array<InputOption>
  name: string
  rules?: ControllerProps['rules']
  onValueChange?: (value: boolean) => void
}

export const RiskAnalysisSwitch: React.FC<RiskAnalysisSwitchProps> = ({
  label,
  infoLabel,
  options,
  name,
  sx,
  rules,
  onValueChange,
  ...switchProps
}) => {
  const { formState } = useFormContext()
  const { t } = useTranslation()

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel}>
      <FormLabel sx={{ color: 'text.primary' }}>
        <Typography component="span" variant="body1">
          {label}
        </Typography>
        <Stack sx={{ mt: 2, mb: 1 }} direction="row" alignItems="center" spacing={0.25}>
          <Controller
            name={name}
            rules={mapValidationErrorMessages(rules, t)}
            render={({ field: { value, ref, onChange, ...fieldProps } }) => (
              <MUISwitch
                {...switchProps}
                {...fieldProps}
                onChange={(e) => {
                  if (onValueChange) onValueChange(e.target.checked)
                  onChange(e.target.checked)
                }}
                checked={value}
                inputRef={ref}
              />
            )}
          />
          {options.length > 0 && (
            <Typography component="span" variant="body2" fontWeight={600}>
              {options[0].label}
            </Typography>
          )}
        </Stack>
      </FormLabel>
    </InputWrapper>
  )
}

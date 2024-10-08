import React from 'react'
import { FormLabel, Switch as MUISwitch, Typography, Stack } from '@mui/material'
import type { SwitchProps as MUISwitchProps } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import { useTranslation } from 'react-i18next'
import type { ControllerProps } from 'react-hook-form/dist/types'
import type { InputOption } from '@/types/common.types'
import RiskAnalysisInputWrapper from './RiskAnalysisInputWrapper'

type RiskAnalysisSwitchProps = Omit<MUISwitchProps, 'checked' | 'onChange'> & {
  label: string
  infoLabel?: string
  helperText?: string
  options: Array<InputOption>
  name: string
  rules?: ControllerProps['rules']
}

export const RiskAnalysisSwitch: React.FC<RiskAnalysisSwitchProps> = ({
  label,
  infoLabel,
  helperText,
  options,
  name,
  rules,
  ...switchProps
}) => {
  const { formState } = useFormContext()
  const { t } = useTranslation()

  const error = formState.errors[name]?.message as string | undefined

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    label,
    infoLabel,
    error,
    helperText,
  })

  return (
    <RiskAnalysisInputWrapper
      label={label}
      error={error}
      infoLabel={infoLabel}
      helperText={helperText}
      {...ids}
    >
      <FormLabel sx={{ color: 'text.primary' }}>
        <Stack sx={{ mt: 2, mb: 1 }} direction="row" alignItems="center" spacing={0.25}>
          <Controller
            name={name}
            rules={mapValidationErrorMessages(rules, t)}
            render={({ field: { value, ref, onChange, ...fieldProps } }) => (
              <MUISwitch
                {...switchProps}
                {...fieldProps}
                inputProps={{
                  ...switchProps.inputProps,
                  'aria-describedby': accessibilityProps['aria-describedby'],
                }}
                onChange={(e) => {
                  onChange(e.target.checked ? 'true' : 'false')
                }}
                checked={value === 'true'}
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
    </RiskAnalysisInputWrapper>
  )
}

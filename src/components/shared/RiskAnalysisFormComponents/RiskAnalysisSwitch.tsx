import React from 'react'
import { FormLabel, Switch as MUISwitch, Typography, Stack } from '@mui/material'
import type { SwitchProps as MUISwitchProps } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import { useTranslation } from 'react-i18next'
import type { ControllerProps } from 'react-hook-form/dist/types'
import type { InputOption } from '@/types/common.types'
import RiskAnalysisInputWrapper from './RiskAnalysisInputWrapper'
import type { RiskAnalysisAnswers } from '@/types/risk-analysis-form.types'

type RiskAnalysisSwitchProps = Omit<MUISwitchProps, 'checked' | 'onChange'> & {
  label: string
  infoLabel?: string
  helperText?: string
  options: Array<InputOption>
  questionId: string
  rules?: ControllerProps['rules']
  isFromPurposeTemplate?: boolean
}

export const RiskAnalysisSwitch: React.FC<RiskAnalysisSwitchProps> = ({
  label,
  infoLabel,
  helperText,
  options,
  questionId,
  rules,
  isFromPurposeTemplate,
  ...switchProps
}) => {
  const { formState } = useFormContext<{ answers: RiskAnalysisAnswers }>()
  const { t } = useTranslation()

  const name = `answers.${questionId}`

  const error = formState.errors.answers?.[questionId]?.message as string | undefined

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
      isFromPurposeTemplate={isFromPurposeTemplate}
      questionId={questionId}
    >
      <FormLabel sx={{ color: 'text.primary' }}>
        <Stack sx={{ mt: 2, mb: 1 }} direction="row" alignItems="center" spacing={1}>
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
            <Typography component="span" variant="body1">
              {options[0].label}
            </Typography>
          )}
        </Stack>
      </FormLabel>
    </RiskAnalysisInputWrapper>
  )
}

import React from 'react'
import { FormLabel, Switch as MUISwitch, Typography, Stack } from '@mui/material'
import type { SwitchProps as MUISwitchProps } from '@mui/material'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import { useTranslation } from 'react-i18next'
import type { ControllerProps } from 'react-hook-form/dist/types'
import type { InputOption } from '@/types/common.types'
import RiskAnalysisInputWrapper from './RiskAnalysisInputWrapper'
import type { RiskAnalysisAnswers } from '@/types/risk-analysis-form.types'
import { isRiskAnalysisQuestionDisabled } from '@/utils/common.utils'

type RiskAnalysisSwitchProps = Omit<MUISwitchProps, 'checked' | 'onChange'> & {
  label: string
  infoLabel?: string
  helperText?: string
  options: Array<InputOption>
  questionId: string
  rules?: ControllerProps['rules']
  isFromPurposeTemplate?: boolean
  type?: 'creator' | 'consumer'
}

export const RiskAnalysisSwitch: React.FC<RiskAnalysisSwitchProps> = ({
  label,
  infoLabel,
  helperText,
  options,
  questionId,
  rules,
  isFromPurposeTemplate,
  type,
  ...switchProps
}) => {
  const { control } = useFormContext()

  const isAssignedToTemplateUsersSwitch = useWatch({
    control,
    name: `assignToTemplateUsers.${questionId}`,
  })
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

  const conditionalRules = isAssignedToTemplateUsersSwitch
    ? { validate: () => true }
    : mapValidationErrorMessages(rules, t)

  return (
    <RiskAnalysisInputWrapper
      label={label}
      error={error}
      infoLabel={infoLabel}
      helperText={helperText}
      {...ids}
      isFromPurposeTemplate={isFromPurposeTemplate}
      questionId={questionId}
      type={type}
      isAssignedToTemplateUsersSwitch={isAssignedToTemplateUsersSwitch}
    >
      <FormLabel sx={{ color: 'text.primary' }}>
        <Stack sx={{ mt: 2, mb: 1 }} direction="row" alignItems="center" spacing={1}>
          <Controller
            name={name}
            rules={conditionalRules}
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
                disabled={isRiskAnalysisQuestionDisabled(
                  isFromPurposeTemplate,
                  type,
                  isAssignedToTemplateUsersSwitch
                )}
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

import React from 'react'
import { Switch as MUISwitch, Typography, Stack, Box } from '@mui/material'
import type { SwitchProps as MUISwitchProps } from '@mui/material'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import { useTranslation } from 'react-i18next'
import type { ControllerProps } from 'react-hook-form/dist/types'
import type { InputOption } from '@/types/common.types'
import RiskAnalysisInputWrapper from './RiskAnalysisInputWrapper'
import { isRiskAnalysisQuestionDisabled } from '@/utils/common.utils'
import { usePurposeCreateContext } from '../PurposeCreateContext'
import { useRiskAnalysisDisplayError } from './RiskAnalysisRequiredMessageContext'

type RiskAnalysisSwitchProps = Omit<MUISwitchProps, 'checked' | 'onChange'> & {
  label: string
  infoLabel?: string
  helperText?: string
  options: Array<InputOption>
  questionKey: string
  rules?: ControllerProps['rules']
}

export const RiskAnalysisSwitch: React.FC<RiskAnalysisSwitchProps> = ({
  label,
  infoLabel,
  helperText,
  options,
  questionKey,
  rules,
  ...switchProps
}) => {
  const { control } = useFormContext()
  const { isFromPurposeTemplate, type } = usePurposeCreateContext()

  const isAssignedToTemplateUsersSwitch = useWatch({
    control,
    name: `assignToTemplateUsers.${questionKey}`,
  })
  const { t } = useTranslation()

  const name = `answers.${questionKey}`

  const error = useRiskAnalysisDisplayError(questionKey)

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    label,
    infoLabel,
    error,
    helperText,
  })

  const conditionalRules =
    isAssignedToTemplateUsersSwitch && type === 'creator'
      ? { validate: () => true }
      : mapValidationErrorMessages(rules, t)

  return (
    <RiskAnalysisInputWrapper
      name={name}
      label={label}
      error={error}
      infoLabel={infoLabel}
      helperText={helperText}
      {...ids}
      isFromPurposeTemplate={isFromPurposeTemplate}
      questionKey={questionKey}
      type={type}
      isAssignedToTemplateUsersSwitch={isAssignedToTemplateUsersSwitch}
    >
      <Box
        component="label"
        htmlFor={name}
        sx={{ color: 'text.primary', display: 'flex', cursor: 'pointer' }}
      >
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
                  ...accessibilityProps,
                  id: name,
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
      </Box>
    </RiskAnalysisInputWrapper>
  )
}

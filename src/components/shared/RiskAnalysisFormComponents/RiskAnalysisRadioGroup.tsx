import React, { useId } from 'react'
import {
  FormControlLabel,
  Radio,
  RadioGroup as MUIRadioGroup,
  type RadioGroupProps as MUIRadioGroupProps,
  Alert,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import type { InputOption } from '@/types/common.types'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import RiskAnalysisInputWrapper from './RiskAnalysisInputWrapper'
import type { RiskAnalysisAnswers } from '@/types/risk-analysis-form.types'
import { FEATURE_FLAG_ESERVICE_PERSONAL_DATA } from '@/config/env'

export type RiskAnalysisRadioGroupProps = Omit<MUIRadioGroupProps, 'onChange'> & {
  questionId: string
  label: string
  infoLabel?: string
  helperText?: string
  disabled?: boolean
  rules?: ControllerProps['rules']
  options: Array<InputOption & { disabled?: boolean }>
  personalDataFlag?: boolean
}

export const RiskAnalysisRadioGroup: React.FC<RiskAnalysisRadioGroupProps> = ({
  questionId,
  label,
  options,
  infoLabel,
  helperText,
  disabled,
  rules,
  personalDataFlag,
  ...props
}) => {
  const { formState, watch } = useFormContext<{ answers: RiskAnalysisAnswers }>()
  const { t } = useTranslation()
  const { t: tShared } = useTranslation('shared-components', {
    keyPrefix: 'create.stepPurpose.riskAnalysis.riskAnalysisSection.personalDataValuesAlert',
  })
  const labelId = useId()

  const name = `answers.${questionId}` as const

  const error = formState.errors.answers?.[questionId]?.message as string | undefined

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    label,
    infoLabel,
    error,
    helperText,
  })

  const currentValue = watch(name)

  const incompatibleAnswerValue = (value: string) => {
    if (
      value.toUpperCase() === 'YES' &&
      (personalDataFlag === false || personalDataFlag === undefined)
    ) {
      return true
    } else if (
      value.toUpperCase() === 'NO' &&
      (personalDataFlag === true || personalDataFlag === undefined)
    ) {
      return true
    }
    return false
  }

  return (
    <RiskAnalysisInputWrapper
      label={label}
      error={error}
      infoLabel={infoLabel}
      helperText={helperText}
      {...ids}
    >
      <Controller
        name={name}
        rules={mapValidationErrorMessages(rules, t)}
        render={({ field: { onChange, ...fieldProps } }) => (
          <MUIRadioGroup
            {...accessibilityProps}
            {...props}
            {...fieldProps}
            onChange={(_, value) => {
              onChange(value)
            }}
          >
            {options.map((o) => (
              <FormControlLabel
                disabled={disabled || o.disabled}
                key={`${labelId}-${o.value}`}
                value={o.value}
                control={<Radio />}
                label={o.label}
                sx={{ mr: 3 }}
              />
            ))}
          </MUIRadioGroup>
        )}
      />
      {FEATURE_FLAG_ESERVICE_PERSONAL_DATA === 'true' &&
        questionId === 'usesPersonalData' &&
        incompatibleAnswerValue(String(currentValue)) && (
          <Alert severity="warning">{tShared('label')}</Alert>
        )}
    </RiskAnalysisInputWrapper>
  )
}

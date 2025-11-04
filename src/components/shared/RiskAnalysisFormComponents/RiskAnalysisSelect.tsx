import React from 'react'
import { MenuItem, Select as MUISelect, type SelectProps as MUISelectProps } from '@mui/material'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import type { InputOption } from '@/types/common.types'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import RiskAnalysisInputWrapper from './RiskAnalysisInputWrapper'
import type { RiskAnalysisAnswers } from '@/types/risk-analysis-form.types'
import { isRiskAnalysisQuestionDisabled } from '@/utils/common.utils'

export type RiskAnalysisSelectProps = Omit<MUISelectProps, 'onChange' | 'label'> & {
  questionId: string
  label: string
  infoLabel?: string
  helperText?: string
  emptyLabel?: string
  options: Array<InputOption>
  rules?: ControllerProps['rules']
  isFromPurposeTemplate?: boolean
  type?: 'creator' | 'consumer'
}

export const RiskAnalysisSelect: React.FC<RiskAnalysisSelectProps> = ({
  questionId,
  label,
  options,
  infoLabel,
  helperText,
  emptyLabel,
  rules,
  isFromPurposeTemplate,
  type,
  ...props
}) => {
  const { control } = useFormContext()

  const isAssignedToTemplateUsersSwitch = useWatch({
    control,
    name: `assignToTemplateUsers.${questionId}`,
  })

  const { t } = useTranslation()
  const { formState } = useFormContext<{ answers: RiskAnalysisAnswers }>()

  const name = `answers.${questionId}`

  const error = formState.errors.answers?.[questionId]?.message as string | undefined

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    label,
    infoLabel,
    error,
    helperText,
  })

  const conditionalRules = isAssignedToTemplateUsersSwitch
    ? { required: false }
    : mapValidationErrorMessages(rules, t)

  return (
    <RiskAnalysisInputWrapper
      label={label}
      infoLabel={infoLabel}
      error={error}
      helperText={helperText}
      {...ids}
      isFromPurposeTemplate={isFromPurposeTemplate}
      questionId={questionId}
      type={type}
      isAssignedToTemplateUsersSwitch={isAssignedToTemplateUsersSwitch}
    >
      <Controller
        name={name}
        rules={conditionalRules}
        render={({ field: { ref, onChange, ...fieldProps } }) => (
          <MUISelect
            {...props}
            {...fieldProps}
            inputProps={{
              ...props.inputProps,
              ...accessibilityProps,
            }}
            onChange={(e) => {
              onChange(e)
            }}
            inputRef={ref}
            disabled={isRiskAnalysisQuestionDisabled(
              isFromPurposeTemplate,
              type,
              isAssignedToTemplateUsersSwitch
            )}
          >
            {options.length > 0 ? (
              options.map((o, i) => (
                <MenuItem key={i} value={o.value}>
                  {o.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">{emptyLabel ?? ''}</MenuItem>
            )}
          </MUISelect>
        )}
      />
    </RiskAnalysisInputWrapper>
  )
}

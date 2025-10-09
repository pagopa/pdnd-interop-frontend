import React from 'react'
import { FormControlLabel, FormGroup, Checkbox } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import type { InputOption } from '@/types/common.types'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { mapValidationErrorMessages } from '@/utils/form.utils'
import RiskAnalysisInputWrapper from './RiskAnalysisInputWrapper'
import type { RiskAnalysisAnswers } from '@/types/risk-analysis-form.types'

export type RiskAnalysisCheckboxGroupProps = {
  questionId: string
  label: string
  infoLabel?: string
  helperText?: string
  options: Array<InputOption>
  rules?: ControllerProps['rules']
  isFromPurposeTemplate?: boolean
}

export const RiskAnalysisCheckboxGroup: React.FC<RiskAnalysisCheckboxGroupProps> = ({
  questionId,
  label,
  options,
  infoLabel,
  helperText,
  rules,
  isFromPurposeTemplate,
}) => {
  const { formState } = useFormContext<{ answers: RiskAnalysisAnswers }>()
  const { t } = useTranslation()

  const name = `answers.${questionId}`

  const error = formState.errors.answers?.[questionId]?.message as string | undefined

  return (
    <RiskAnalysisInputWrapper
      isInputGroup
      label={label}
      infoLabel={infoLabel}
      helperText={helperText}
      error={error}
      isFromPurposeTemplate={isFromPurposeTemplate}
      questionId={questionId}
    >
      <FormGroup>
        <Controller
          name={name}
          rules={mapValidationErrorMessages(rules, t)}
          render={({ field }) => {
            const onChange = (e: React.SyntheticEvent) => {
              const target = e.target as HTMLInputElement
              const prevValue = (field.value ?? []) as Array<string>

              const newValue = prevValue?.includes(target.name)
                ? prevValue.filter((v: unknown) => v !== target.name)
                : [...prevValue, target.name]

              field.onChange(newValue)
            }

            return (
              <>
                {options.map((o) => (
                  <FormControlLabel
                    key={o.value}
                    value={o.value}
                    control={
                      <Checkbox
                        checked={field.value?.includes(o.value) ?? false}
                        onChange={onChange}
                        name={String(o.value)}
                      />
                    }
                    label={o.label}
                    sx={{ mr: 3 }}
                  />
                ))}
              </>
            )
          }}
        />
      </FormGroup>
    </RiskAnalysisInputWrapper>
  )
}

import React from 'react'
import { FormControlLabel, FormGroup, Checkbox } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import type { InputOption } from '@/types/common.types'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { mapValidationErrorMessages } from '@/utils/form.utils'
import RiskAnalysisInputWrapper from './RiskAnalysisInputWrapper'

export type RiskAnalysisCheckboxGroupProps = {
  name: string
  label: string
  infoLabel?: string
  helperText?: string
  options: Array<InputOption>
  rules?: ControllerProps['rules']
}

export const RiskAnalysisCheckboxGroup: React.FC<RiskAnalysisCheckboxGroupProps> = ({
  name,
  label,
  options,
  infoLabel,
  helperText,
  rules,
}) => {
  const { formState } = useFormContext()
  const { t } = useTranslation()

  const error = formState.errors[name]?.message as string | undefined

  return (
    <RiskAnalysisInputWrapper
      isInputGroup
      label={label}
      infoLabel={infoLabel}
      helperText={helperText}
      error={error}
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

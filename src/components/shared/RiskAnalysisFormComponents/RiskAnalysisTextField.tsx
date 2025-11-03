import React from 'react'
import { Stack, IconButton, OutlinedInput, type OutlinedInputProps, Button } from '@mui/material'
import { Controller, useFormContext, useForm, FormProvider } from 'react-hook-form'
import type { ControllerProps } from 'react-hook-form/dist/types/controller'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import { RHFSelect, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import RiskAnalysisInputWrapper from './RiskAnalysisInputWrapper'
import type { RiskAnalysisAnswers } from '@/types/risk-analysis-form.types'
import { RemoveCircleOutline } from '@mui/icons-material'

export type RiskAnalysisTextFieldProps = Omit<OutlinedInputProps, 'type'> & {
  questionId: string
  label: string
  infoLabel?: string
  helperText?: string
  formHelper?: string
  rules?: ControllerProps['rules']
  isFromPurposeTemplate?: boolean
  questionType?: string
  type?: 'creator' | 'consumer'
}

export const RiskAnalysisTextField: React.FC<RiskAnalysisTextFieldProps> = ({
  questionId,
  label,
  infoLabel,
  helperText,
  multiline,
  rules,
  isFromPurposeTemplate,
  questionType,
  type,
  ...props
}) => {
  const { setValue, watch } = useFormContext()

  // Form for suggested value input
  const suggestedValueFormMethods = useForm<{ suggestedValue: string }>({
    defaultValues: { suggestedValue: '' },
    shouldUnregister: true,
  })

  const { formState } = useFormContext<{ answers: RiskAnalysisAnswers }>()
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'edit.step3' })
  const { t: tCommon } = useTranslation('common')

  const name = `answers.${questionId}`
  const suggestedValuesName = `suggestedValues.${questionId}`

  const error = formState.errors.answers?.[questionId]?.message as string | undefined
  const suggestedValues: string[] = watch(suggestedValuesName) || []

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    label,
    infoLabel,
    error,
    helperText,
  })

  const conditionalRules = mapValidationErrorMessages(rules, tCommon)

  const handleAddSuggestedValue = () => {
    const suggestedValue = suggestedValueFormMethods.getValues('suggestedValue')
    if (suggestedValue.trim()) {
      const currentValues = suggestedValues || []
      setValue(suggestedValuesName, [...currentValues, suggestedValue.trim()], {
        shouldDirty: true,
      })
      suggestedValueFormMethods.reset({ suggestedValue: '' })
    }
  }

  const handleRemoveSuggestedValue = (index: number) => {
    const currentValues = suggestedValues || []
    const newValues = currentValues.filter((_, i) => i !== index)
    setValue(suggestedValuesName, newValues, { shouldDirty: true })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSuggestedValue()
    }
  }

  // If this is from purpose template, show the new suggested values UI
  if (isFromPurposeTemplate) {
    return (
      <RiskAnalysisInputWrapper
        name={name}
        label={label}
        infoLabel={infoLabel}
        error={error}
        {...ids}
        isFromPurposeTemplate={isFromPurposeTemplate}
        questionId={questionId}
        questionType={questionType}
        type={type}
      >
        {type === 'consumer' ? (
          <RHFSelect
            label="Risposte suggerite" //TODO
            options={suggestedValues.map((value) => ({ label: value, value }))}
            name="suggestedValueConsumer"
          />
        ) : (
          <Stack spacing={2}>
            {/* Input field and add button */}
            <Stack direction="column" spacing={2} alignItems="flex-start">
              <FormProvider {...suggestedValueFormMethods}>
                <RHFTextField
                  fullWidth
                  label={t('answerInputPlaceholder')}
                  name="suggestedValue"
                  size="small"
                  onKeyDown={handleKeyDown}
                  sx={{ flex: 1 }}
                />
              </FormProvider>
              <Button
                variant="contained"
                startIcon={<AddIcon fontSize="small" />}
                onClick={handleAddSuggestedValue}
                disabled={!suggestedValueFormMethods.watch('suggestedValue')?.trim()}
              >
                {t('addAnswerBtn')}
              </Button>
            </Stack>

            {/* List of suggested values */}
            {suggestedValues.length > 0 && (
              <Stack spacing={2}>
                {suggestedValues.map((value, index) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="center">
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveSuggestedValue(index)}
                      sx={{ color: 'error.main' }}
                    >
                      <RemoveCircleOutline fontSize="small" />
                    </IconButton>
                    <RHFTextField
                      fullWidth
                      value={value}
                      disabled
                      size="small"
                      label={t('answerInputPlaceholder')}
                      name={`readonly-${index}`} // RHFTextField requires a name
                      sx={{ flex: 1 }}
                    />
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
        )}
      </RiskAnalysisInputWrapper>
    )
  }

  // Original behavior for non-purpose template forms
  return (
    <RiskAnalysisInputWrapper
      name={name}
      label={label}
      infoLabel={infoLabel}
      helperText={helperText}
      error={error}
      {...ids}
      isFromPurposeTemplate={isFromPurposeTemplate}
      questionId={questionId}
    >
      <Controller
        name={name}
        rules={conditionalRules}
        render={({ field: { ref, onChange, ...fieldProps } }) => (
          <OutlinedInput
            {...props}
            inputProps={{ ...props.inputProps, ...accessibilityProps }}
            multiline={multiline}
            rows={multiline ? 6 : undefined}
            error={!!error}
            onChange={(e) => {
              onChange(e)
            }}
            inputRef={ref}
            {...fieldProps}
            disabled={false}
          />
        )}
      />
    </RiskAnalysisInputWrapper>
  )
}

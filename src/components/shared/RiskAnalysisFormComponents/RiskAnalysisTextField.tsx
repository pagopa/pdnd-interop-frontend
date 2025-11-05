import React from 'react'
import { Stack, IconButton, OutlinedInput, type OutlinedInputProps, Button } from '@mui/material'
import { Controller, useFormContext, useForm, FormProvider, useWatch } from 'react-hook-form'
import type { ControllerProps } from 'react-hook-form/dist/types/controller'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import { RHFTextField, RHFSelect } from '@/components/shared/react-hook-form-inputs'
import RiskAnalysisInputWrapper from './RiskAnalysisInputWrapper'
import type { RiskAnalysisAnswers } from '@/types/risk-analysis-form.types'
import { RemoveCircleOutline } from '@mui/icons-material'
import { usePurposeCreateContext } from '../PurposeCreateContext'

export type RiskAnalysisTextFieldProps = Omit<OutlinedInputProps, 'type'> & {
  questionId: string
  label: string
  infoLabel?: string
  helperText?: string
  formHelper?: string
  rules?: ControllerProps['rules']
  questionType?: string
}

export const RiskAnalysisTextField: React.FC<RiskAnalysisTextFieldProps> = ({
  questionId,
  label,
  infoLabel,
  helperText,
  multiline,
  rules,
  questionType,
  ...props
}) => {
  const { setValue, watch, control } = useFormContext()

  // Form for suggested value input
  const suggestedValueFormMethods = useForm<{ suggestedValue: string }>({
    defaultValues: { suggestedValue: '' },
    shouldUnregister: true,
  })

  const { formState } = useFormContext<{ answers: RiskAnalysisAnswers }>()
  const { isFromPurposeTemplate, type } = usePurposeCreateContext()
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'edit.step3' })
  const { t: tCommon } = useTranslation('common')

  const name = `answers.${questionId}`
  const suggestedValuesName = `suggestedValues.${questionId}`
  const suggestedValueConsumerName = `suggestedValueConsumer.${questionId}`

  // Check if question is editable (for consumer, editable=true means user can answer)
  const isEditable = useWatch({
    control,
    name: `assignToTemplateUsers.${questionId}`,
  }) as boolean | undefined

  const error = formState.errors.answers?.[questionId]?.message as string | undefined
  const suggestedValues: string[] = watch(suggestedValuesName) || []

  // For freeText questions with suggestedValues in consumer mode, check error on suggestedValueConsumer field
  const suggestedValueConsumerError = (
    formState.errors as Record<string, Record<string, { message?: string }>>
  ).suggestedValueConsumer?.[questionId]?.message as string | undefined
  const displayError =
    suggestedValues.length > 0 && type === 'consumer' ? suggestedValueConsumerError || error : error

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    label,
    infoLabel,
    error: displayError,
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
        error={displayError}
        {...ids}
        isFromPurposeTemplate={isFromPurposeTemplate}
        questionId={questionId}
        questionType={questionType}
        type={type}
        isAssignedToTemplateUsersSwitch={true}
      >
        {type === 'consumer' && suggestedValues.length > 0 && !isEditable ? (
          // Show select only if there are suggestedValues AND question is not editable
          <RHFSelect
            name={suggestedValueConsumerName}
            label="Risposte suggerite" //TODO
            options={suggestedValues.map((value) => ({ label: value, value }))}
            rules={{ required: true }}
          />
        ) : type === 'consumer' ? (
          // Show textArea for consumer if editable or no suggestedValues
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

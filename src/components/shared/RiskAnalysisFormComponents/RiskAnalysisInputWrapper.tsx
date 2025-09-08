import { SectionContainer } from '@/components/layout/containers'
import { FormControl, FormHelperText, FormLabel, Stack, Typography } from '@mui/material'
import React from 'react'
import { RiskAnalysisAnswerComponent } from '@/pages/ConsumerPurposeTemplateEditPage/components/PurposeTemplateEditStepRiskAnalysis/RiskAnalysisForm/RiskAnalysisAnswerComponent'

type RiskAnalysisInputWrapperProps = {
  children: React.ReactNode
  name?: string
  label: string
  infoLabel?: string
  helperText?: string
  error?: string
  labelId?: string
  infoLabelId?: string
  helperTextId?: string
  errorId?: string
  isInputGroup?: boolean
  isFromPurposeTemplate?: boolean
}

const RiskAnalysisInputWrapper: React.FC<RiskAnalysisInputWrapperProps> = ({
  children,
  name,
  label,
  infoLabel,
  helperText,
  helperTextId,
  labelId,
  infoLabelId,
  error,
  errorId,
  isInputGroup,
  isFromPurposeTemplate,
}) => {
  return (
    <SectionContainer component={isInputGroup ? 'fieldset' : 'div'}>
      <SectionContainer
        innerSection
        {...(isFromPurposeTemplate ? { sx: { border: 1, borderColor: 'lightgrey', p: 3 } } : {})}
      >
        <FormControl fullWidth error={!!error}>
          <Stack spacing={1} sx={{ mb: 4 }}>
            <FormLabel
              htmlFor={name}
              component={isInputGroup ? 'legend' : 'label'}
              id={labelId}
              sx={{ fontWeight: 600 }}
            >
              {label}
            </FormLabel>
            {infoLabel && (
              <Typography
                id={infoLabelId}
                component="span"
                variant="caption"
                color="text.secondary"
              >
                {infoLabel}
              </Typography>
            )}
          </Stack>
          {children}

          {helperText && (
            <FormHelperText
              component="span"
              id={helperTextId}
              error={false}
              sx={{ fontWeight: 400, ml: 0, display: 'block' }}
            >
              {helperText}
            </FormHelperText>
          )}

          {error && (
            <FormHelperText
              id={errorId}
              component="span"
              sx={{ fontWeight: 400, ml: 0, display: 'block' }}
            >
              {error}
            </FormHelperText>
          )}
        </FormControl>
      </SectionContainer>
      {isFromPurposeTemplate && <RiskAnalysisAnswerComponent />}
    </SectionContainer>
  )
}

export default RiskAnalysisInputWrapper

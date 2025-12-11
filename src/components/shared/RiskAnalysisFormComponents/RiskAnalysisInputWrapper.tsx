import { SectionContainer } from '@/components/layout/containers'
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import React from 'react'
import { RiskAnalysisAnswerComponent } from '@/pages/ConsumerPurposeTemplateEditPage/components/PurposeTemplateEditStepRiskAnalysis/RiskAnalysisForm/RiskAnalysisAnswerComponent'
import { RiskAnalysisReadAnnotationsComponent } from '@/pages/ConsumerPurposeFromTemplateEditPage/components/PurposeFromTemplateEditStepRiskAnalysis/RiskAnalysisReadAnnotationsComponent'
import { useTranslation } from 'react-i18next'

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
  questionKey: string
  questionType?: string
  type?: 'creator' | 'consumer'
  isAssignedToTemplateUsersSwitch?: boolean
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
  questionKey,
  questionType,
  type,
  isAssignedToTemplateUsersSwitch,
}) => {
  const { t } = useTranslation('common')
  const { t: tShared } = useTranslation('shared-components', {
    keyPrefix: 'purposeTemplateRiskAnalysisInfoSummary',
  })
  return (
    <SectionContainer component={isInputGroup ? 'fieldset' : 'div'}>
      <SectionContainer
        innerSection
        {...(isFromPurposeTemplate ? { sx: { border: 1, borderColor: 'lightgrey', p: 3 } } : {})}
      >
        <FormControl fullWidth error={!!error}>
          <Stack spacing={1} sx={{ mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <FormLabel
                  htmlFor={name}
                  component={isInputGroup ? 'legend' : 'label'}
                  id={labelId}
                  sx={{ fontWeight: 600 }}
                >
                  {label}
                </FormLabel>
              </Box>
              {isFromPurposeTemplate && type === 'consumer' && !isAssignedToTemplateUsersSwitch && (
                <Tooltip title={tShared('notEditableTooltip')}>
                  <Chip
                    size="small"
                    label={t('notEditableLabel')}
                    color="default"
                    sx={{
                      borderRadius: 1,
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}
                  />
                </Tooltip>
              )}
            </Box>
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
      {isFromPurposeTemplate && (
        <>
          {type === 'creator' && questionKey !== 'usesPersonalData' && (
            <RiskAnalysisAnswerComponent
              question={label}
              questionKey={questionKey}
              questionType={questionType as string}
            />
          )}
          {type === 'consumer' && (
            <RiskAnalysisReadAnnotationsComponent questionKey={questionKey} />
          )}
        </>
      )}
    </SectionContainer>
  )
}

export default RiskAnalysisInputWrapper

import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Box, Link, Stack } from '@mui/material'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import { StepActions } from '@/components/shared/StepActions'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import {
  RiskAnalysisFormComponents,
  RiskAnalysisRequiredMessageProvider,
} from '@/components/shared/RiskAnalysisFormComponents'
import { useRiskAnalysisForm } from '@/hooks/useRiskAnalysisForm'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { getValidAnswers } from '@/utils/risk-analysis-form.utils'
import { RiskAnalysisRejectionDrawer } from '@/components/shared/RiskAnalysisRejectionDrawer'

type RiskAnalysisFormProps = {
  defaultAnswers: Record<string, string[]>
  riskAnalysis: RiskAnalysisFormConfig
  onSubmit: (answers: Record<string, string[]>) => void
  onCancel: VoidFunction
  personalData?: boolean
  isReviewerApprovalMode?: boolean
  onSaveDraft?: (answers: Record<string, string[]>) => void
  isSubmitting?: boolean
  isRejected?: boolean
  rejectionReason?: string
  submitLabel?: string
}

export const RiskAnalysisForm: React.FC<RiskAnalysisFormProps> = ({
  defaultAnswers,
  riskAnalysis,
  onSubmit,
  onCancel,
  personalData,
  isReviewerApprovalMode = false,
  onSaveDraft,
  isSubmitting = false,
  isRejected = false,
  rejectionReason,
  submitLabel,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit' })
  const [isRejectionDrawerOpen, setIsRejectionDrawerOpen] = React.useState(false)

  const riskAnalysisForm = useRiskAnalysisForm({
    riskAnalysisConfig: riskAnalysis,
    defaultAnswers: defaultAnswers,
  })

  const [incompatibleAnswerValue, setIncompatibleAnswerValue] = React.useState<boolean>(false)
  const [showRequiredAlert, setShowRequiredAlert] = React.useState<boolean>(false)

  const checkIncompatibleAnswerValue = (answers: Record<string, string[]>) => {
    if (personalData === undefined) {
      return false
    }
    const userAnswer = answers['usesPersonalData']?.[0]
    const isYes = userAnswer === 'YES'
    const isNo = userAnswer === 'NO'

    const incompatible = (isYes && personalData !== true) || (isNo && personalData !== false)

    return incompatible
  }

  const handleValidSubmit = ({ validAnswers }: { validAnswers: Record<string, string[]> }) => {
    setShowRequiredAlert(false)
    setIncompatibleAnswerValue(false)

    if (checkIncompatibleAnswerValue(validAnswers)) {
      setIncompatibleAnswerValue(true)
      riskAnalysisForm.setError('answers.usesPersonalData', {
        type: 'manual',
        message: t('stepRiskAnalysis.personalDataFlag.incompatibleAnswerError.purposeEdit'),
      })
      return
    }

    onSubmit(validAnswers)
  }

  const handleInvalidSubmit = () => {
    if (isReviewerApprovalMode) {
      setShowRequiredAlert(true)
    }
  }

  const handleSubmit = riskAnalysisForm.handleSubmit(handleValidSubmit, handleInvalidSubmit)

  const handleSaveDraftClick = () => {
    if (!onSaveDraft) return
    const values = riskAnalysisForm.getValues()
    const visibleQuestionsIds = Object.keys(riskAnalysisForm.questions)
    onSaveDraft(getValidAnswers(visibleQuestionsIds, values.answers))
  }

  const requiredMessageOverride = isReviewerApprovalMode
    ? t('stepRiskAnalysis.requiredFieldErrorReviewer')
    : undefined

  return (
    <FormProvider {...riskAnalysisForm}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        {isRejected && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Link
                component="button"
                type="button"
                variant="body2"
                underline="hover"
                onClick={() => setIsRejectionDrawerOpen(true)}
              >
                {t('stepRiskAnalysis.rejectedAlertLinkLabel')}
              </Link>
            }
          >
            {t('stepRiskAnalysis.rejectedAlert')}
          </Alert>
        )}
        <SectionContainer
          title={t('stepRiskAnalysis.title')}
          description={t('stepRiskAnalysis.description')}
          sx={{ mb: 2 }}
        >
          <InformationContainer
            label={t('stepRiskAnalysis.personalDataFlag.label')}
            content={t(`stepRiskAnalysis.personalDataFlag.content.${personalData}`)}
          />
        </SectionContainer>
        <RiskAnalysisRequiredMessageProvider value={requiredMessageOverride}>
          <Stack spacing={2}>
            <Alert sx={{ mt: 4, mb: 2 }} severity="warning">
              {t('stepRiskAnalysis.personalInfoAlert')}
            </Alert>
            <RiskAnalysisFormComponents questions={riskAnalysisForm.questions} />
          </Stack>
        </RiskAnalysisRequiredMessageProvider>
        {incompatibleAnswerValue && (
          <Alert sx={{ mt: 2 }} severity="warning">
            {!personalData
              ? t(
                  'stepRiskAnalysis.personalDataFlag.alertForIncompatibleAnswerPurpose.personalData'
                )
              : t(
                  'stepRiskAnalysis.personalDataFlag.alertForIncompatibleAnswerPurpose.noPersonalData'
                )}
          </Alert>
        )}
        {isReviewerApprovalMode && showRequiredAlert && (
          <Alert sx={{ mt: 2 }} severity="error">
            {t('stepRiskAnalysis.requestApprovalAlert')}
          </Alert>
        )}
        <StepActions
          back={{
            label: t('backWithoutSaveBtn'),
            type: 'button',
            onClick: onCancel,
            startIcon: <ArrowBackIcon />,
          }}
          secondaryAction={
            isReviewerApprovalMode
              ? {
                  label: t('stepRiskAnalysis.saveDraftBtn'),
                  type: 'button',
                  onClick: handleSaveDraftClick,
                  startIcon: <SaveIcon />,
                  disabled: isSubmitting,
                }
              : undefined
          }
          forward={
            isReviewerApprovalMode
              ? {
                  label: t('stepRiskAnalysis.requestApprovalBtn'),
                  type: 'submit',
                  startIcon: <SendIcon />,
                  disabled: isSubmitting,
                }
              : {
                  label: submitLabel ?? t('endWithSaveBtn'),
                  type: 'submit',
                  startIcon: <SaveIcon />,
                }
          }
        />
      </Box>
      {isRejected && (
        <RiskAnalysisRejectionDrawer
          isOpen={isRejectionDrawerOpen}
          onClose={() => setIsRejectionDrawerOpen(false)}
          rejectionReason={rejectionReason ?? ''}
        />
      )}
    </FormProvider>
  )
}

export const RiskAnalysisFormSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={600} />
}

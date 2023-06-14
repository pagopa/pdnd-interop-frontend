import React from 'react'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { RiskAnalysisForm, RiskAnalysisFormSkeleton } from './RiskAnalysisForm/RiskAnalysisForm'
import { useNavigate, useParams } from '@/router'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { NotFoundError } from '@/utils/errors.utils'
import { RiskAnalysisVersionMismatchDialog } from './RiskAnalysisForm'
import { StepActions } from '@/components/shared/StepActions'
import { useTranslation } from 'react-i18next'

export const PurposeEditStep2RiskAnalysis: React.FC<ActiveStepProps> = ({ back, forward }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit' })
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const navigate = useNavigate()

  const [shouldProceedWithVersionMismatch, setShouldProceedWithVersionMismatch] =
    React.useState(false)

  const { mutate: updatePurpose } = PurposeMutations.useUpdateDraft()
  const { data: purpose, isLoading: isLoadingPurpose } = PurposeQueries.useGetSingle(purposeId, {
    suspense: false,
  })
  const { data: riskAnalysis } = PurposeQueries.useGetRiskAnalysisLatest({
    suspense: false,
  })

  if (isLoadingPurpose || !riskAnalysis) {
    return <RiskAnalysisFormSkeleton />
  }

  if (!purpose) {
    throw new NotFoundError()
  }

  const hasVersionMismatch =
    purpose.riskAnalysisForm && riskAnalysis.version !== purpose.riskAnalysisForm.version

  if (!shouldProceedWithVersionMismatch && hasVersionMismatch) {
    return (
      <RiskAnalysisVersionMismatchDialog
        onProceed={() => {
          setShouldProceedWithVersionMismatch(true)
        }}
        onRefuse={() => {
          navigate('SUBSCRIBE_PURPOSE_LIST')
        }}
      />
    )
  }

  const handleSubmit = (answers: Record<string, string[]>) => {
    updatePurpose(
      {
        purposeId: purpose.id,
        title: purpose.title,
        description: purpose.description,
        riskAnalysisForm: { version: riskAnalysis.version, answers },
      },
      { onSuccess: forward }
    )
  }

  return (
    <>
      <RiskAnalysisForm
        riskAnalysis={riskAnalysis}
        defaultAnswers={purpose.riskAnalysisForm?.answers}
        onSubmit={handleSubmit}
      />
      <StepActions
        back={{ label: t('backWithoutSaveBtn'), type: 'button', onClick: back }}
        forward={{
          label: t('forwardWithSaveBtn'),
          type: 'submit',
        }}
      />
    </>
  )
}

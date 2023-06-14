import React from 'react'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { RiskAnalysisForm, RiskAnalysisFormSkeleton } from './RiskAnalysisForm/RiskAnalysisForm'
import { useNavigate, useParams } from '@/router'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { RiskAnalysisVersionMismatchDialog } from './RiskAnalysisForm'

export const PurposeEditStep2RiskAnalysis: React.FC<ActiveStepProps> = ({ back, forward }) => {
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const navigate = useNavigate()

  const [shouldProceedWithVersionMismatch, setShouldProceedWithVersionMismatch] =
    React.useState(false)

  const { mutate: updatePurpose } = PurposeMutations.useUpdateDraft()
  const { data: purpose } = PurposeQueries.useGetSingle(purposeId, {
    suspense: false,
  })
  const { data: riskAnalysis } = PurposeQueries.useGetRiskAnalysisLatest({
    suspense: false,
  })

  if (!purpose || !riskAnalysis) {
    return <RiskAnalysisFormSkeleton />
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
    <RiskAnalysisForm
      riskAnalysis={riskAnalysis}
      defaultAnswers={purpose.riskAnalysisForm?.answers}
      onSubmit={handleSubmit}
      onCancel={back}
    />
  )
}

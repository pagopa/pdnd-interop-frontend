import React from 'react'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { RiskAnalysisForm, RiskAnalysisFormSkeleton } from './RiskAnalysisForm/RiskAnalysisForm'
import { useNavigate, useParams } from '@/router'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { RiskAnalysisVersionMismatchDialog } from './RiskAnalysisForm'

export const PurposeEditStepRiskAnalysis: React.FC<ActiveStepProps> = ({ back }) => {
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

  const goToSummary = () => {
    navigate('SUBSCRIBE_PURPOSE_SUMMARY', {
      params: {
        purposeId: purposeId,
      },
    })
  }

  const handleSubmit = (answers: Record<string, string[]>) => {
    updatePurpose(
      {
        purposeId: purpose.id,
        title: purpose.title,
        description: purpose.description,
        riskAnalysisForm: { version: riskAnalysis.version, answers },
        freeOfChargeReason: purpose.freeOfChargeReason,
        isFreeOfCharge: purpose.isFreeOfCharge,
        dailyCalls: purpose.currentVersion!.dailyCalls, // the current version is always present due to it being set in step 1
      },
      { onSuccess: goToSummary }
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

import React from 'react'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { RiskAnalysisForm, RiskAnalysisFormSkeleton } from './RiskAnalysisForm/RiskAnalysisForm'
import { useNavigate, useParams } from '@/router'
//import { RiskAnalysisVersionMismatchDialog } from './RiskAnalysisForm'
import { useCheckRiskAnalysisVersionMismatch } from '@/hooks/useCheckRiskAnalysisVersionMismatch'
import { useQuery } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { PurposeQueries } from '@/api/purpose'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'

export const PurposeTemplateEditStepRiskAnalysis: React.FC<ActiveStepProps> = ({ back }) => {
  const { purposeTemplateId } = useParams<'SUBCRIBE_PURPOSE_TEMPLATE_EDIT'>()
  const navigate = useNavigate()

  const [shouldProceedWithVersionMismatch, setShouldProceedWithVersionMismatch] =
    React.useState(false)

  const { mutate: updatePurposeTemplate } = PurposeTemplateMutations.useUpdateDraft()
  const { data: purposeTemplate } = useQuery(PurposeTemplateQueries.getSingle(purposeTemplateId))

  const { data: riskAnalysis } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({ tenantKind: purposeTemplate?.targetTenantKind }) //TODO: PURPOSE TEMPLATE QUERIES?
  )

  //const hasVersionMismatch = useCheckRiskAnalysisVersionMismatch(purposeTemplate)

  if (!purposeTemplate || !riskAnalysis) {
    return <RiskAnalysisFormSkeleton />
  }

  //   if (!shouldProceedWithVersionMismatch && hasVersionMismatch) {
  //     return (
  //       <RiskAnalysisVersionMismatchDialog
  //         onProceed={() => {
  //           setShouldProceedWithVersionMismatch(true)
  //         }}
  //         onRefuse={() => {
  //           navigate('SUBSCRIBE_PURPOSE_LIST')
  //         }}
  //       />
  //     )
  //   }

  const goToSummary = () => {
    navigate('SUBSCRIBE_PURPOSE_TEMPLATE_SUMMARY', {
      params: {
        purposeTemplateId: purposeTemplateId,
      },
    })
  }

  const handleSubmit = (answers: Record<string, string[]>) => {
    updatePurposeTemplate(
      {
        purposeTemplateId: purposeTemplate.id,
        title: purposeTemplate.purposeTitle,
        description: purposeTemplate.purposeDescription,
        riskAnalysisForm: { version: riskAnalysis.version, answers },
        freeOfChargeReason: purposeTemplate.purposeFreeOfChargeReason,
        isFreeOfCharge: purposeTemplate.purposeIsFreeOfCharge,
        dailyCalls: purposeTemplate.purposeDailyCalls, // the current version is always present due to it being set in step 1
      },
      { onSuccess: goToSummary }
    )
  }

  return (
    <RiskAnalysisForm
      riskAnalysis={riskAnalysis}
      defaultAnswers={purposeTemplate.purposeRiskAnalysisForm.answers}
      onSubmit={handleSubmit}
      onCancel={back}
    />
  )
}

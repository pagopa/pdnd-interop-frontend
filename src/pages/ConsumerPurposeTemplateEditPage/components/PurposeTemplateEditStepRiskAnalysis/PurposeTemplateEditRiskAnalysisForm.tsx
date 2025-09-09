import React from 'react'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { RiskAnalysisForm, RiskAnalysisFormSkeleton } from './RiskAnalysisForm/RiskAnalysisForm'
import { useNavigate, useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { PurposeQueries } from '@/api/purpose'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'

export const PurposeTemplateEditStepRiskAnalysis: React.FC<ActiveStepProps> = ({ back }) => {
  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_TEMPLATE_EDIT'>()
  const navigate = useNavigate()

  const { mutate: updatePurposeTemplate } = PurposeTemplateMutations.useUpdateDraft()
  const { data: purposeTemplate } = useQuery(PurposeTemplateQueries.getSingle(purposeTemplateId))

  const { data: riskAnalysis } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({ tenantKind: purposeTemplate?.targetTenantKind }) //TODO: PURPOSE TEMPLATE QUERIES?
  )

  if (!purposeTemplate || !riskAnalysis) {
    return <RiskAnalysisFormSkeleton />
  }

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
        riskAnalysisForm: { version: riskAnalysis.version, answers }, //TODO
        freeOfChargeReason: purposeTemplate.purposeFreeOfChargeReason,
        isFreeOfCharge: purposeTemplate.purposeIsFreeOfCharge,
        dailyCalls: purposeTemplate.purposeDailyCalls,
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

import React from 'react'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import {
  RiskAnalysisFormTemplate,
  RiskAnalysisFormTemplateSkeleton,
} from './RiskAnalysisForm/RiskAnalysisFormTemplate'
import { useNavigate, useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { PurposeQueries } from '@/api/purpose'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import type {
  RiskAnalysisFormTemplateSeed,
  RiskAnalysisTemplateAnswerSeed,
} from '@/api/api.generatedTypes'

export const PurposeTemplateEditStepRiskAnalysis: React.FC<ActiveStepProps> = ({ back }) => {
  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_TEMPLATE_EDIT'>()
  const _navigate = useNavigate()

  const { mutate: updatePurposeTemplate } = PurposeTemplateMutations.useUpdateDraft()
  const { data: purposeTemplate } = useQuery(PurposeTemplateQueries.getSingle(purposeTemplateId))

  const { data: riskAnalysis } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({ tenantKind: purposeTemplate?.targetTenantKind }) //TODO: PURPOSE TEMPLATE QUERIES?
  )

  if (!purposeTemplate || !riskAnalysis || !purposeTemplate.purposeRiskAnalysisForm) {
    return <RiskAnalysisFormTemplateSkeleton />
  }

  const goToSummary = () => {
    // navigate('SUBSCRIBE_PURPOSE_TEMPLATE_SUMMARY', {
    //   params: {
    //     purposeTemplateId: purposeTemplateId,
    //   },
    // })
    return //todo
  }

  const handleSubmit = (riskAnalysisFormTemplateSeed: RiskAnalysisFormTemplateSeed) => {
    updatePurposeTemplate(
      {
        purposeTemplateId: purposeTemplate.id,
        purposeTitle: purposeTemplate.purposeTitle,
        purposeDescription: purposeTemplate.purposeDescription,
        purposeRiskAnalysisForm: riskAnalysisFormTemplateSeed,
        purposeFreeOfChargeReason: purposeTemplate.purposeFreeOfChargeReason,
        purposeIsFreeOfCharge: purposeTemplate.purposeIsFreeOfCharge,
        purposeDailyCalls: purposeTemplate.purposeDailyCalls,
        targetDescription: purposeTemplate.targetDescription,
        targetTenantKind: purposeTemplate.targetTenantKind,
      },
      { onSuccess: goToSummary }
    )
  }

  // Use the answers directly - no complex transformations needed
  const defaultAnswers = purposeTemplate.purposeRiskAnalysisForm.answers as Record<
    string,
    RiskAnalysisTemplateAnswerSeed
  >

  return (
    <RiskAnalysisFormTemplate
      riskAnalysis={riskAnalysis}
      defaultAnswers={defaultAnswers}
      onSubmit={handleSubmit}
      onCancel={back}
    />
  )
}

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
  RiskAnalysisTemplateAnswer,
} from '@/api/api.generatedTypes'

export const PurposeTemplateEditStepRiskAnalysis: React.FC<ActiveStepProps> = ({ back }) => {
  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_TEMPLATE_EDIT'>()
  const navigate = useNavigate()

  const { mutate: updatePurposeTemplate } = PurposeTemplateMutations.useUpdateDraft()
  const { data: purposeTemplate } = useQuery(PurposeTemplateQueries.getSingle(purposeTemplateId))

  const { data: riskAnalysis } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({ tenantKind: purposeTemplate?.targetTenantKind })
  )

  if (!purposeTemplate || !riskAnalysis || !purposeTemplate.purposeRiskAnalysisForm) {
    return <RiskAnalysisFormTemplateSkeleton />
  }

  const goToSummary = () => {
    navigate('SUBSCRIBE_PURPOSE_TEMPLATE_SUMMARY', {
      params: {
        purposeTemplateId,
      },
    })
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
        handlesPersonalData: purposeTemplate.handlesPersonalData,
      },
      {
        onSuccess: goToSummary,
        onError: (error) => {
          console.error('Failed to update purpose template:', error)
        },
      }
    )
  }

  // Use the answers directly - no complex transformations needed
  const defaultAnswers = purposeTemplate.purposeRiskAnalysisForm.answers as Record<
    string,
    RiskAnalysisTemplateAnswer
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

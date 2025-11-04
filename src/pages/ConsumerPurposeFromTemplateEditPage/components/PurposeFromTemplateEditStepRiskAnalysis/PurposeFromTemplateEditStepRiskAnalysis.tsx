import { PurposeQueries } from '@/api/purpose/purpose.queries'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { useParams, useNavigate } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { RiskAnalysisFormTemplate } from '@/pages/ConsumerPurposeTemplateEditPage/components/PurposeTemplateEditStepRiskAnalysis'
import type {
  RiskAnalysisTemplateAnswer,
  PatchPurposeUpdateFromTemplateContent,
  RiskAnalysisFormSeed,
} from '@/api/api.generatedTypes'
import React from 'react'
import { PurposeMutations } from '@/api/purpose/purpose.mutations'

const PurposeFromTemplateEditStepRiskAnalysis: React.FC = () => {
  const { purposeTemplateId, purposeId } = useParams<'SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT'>()
  const navigate = useNavigate()
  const { mutate: updatePurposeFromTemplate } = PurposeMutations.useUpdateDraftFromPurposeTemplate()

  const { data: purposeTemplate } = useQuery(PurposeTemplateQueries.getSingle(purposeTemplateId))
  const { data: purpose } = useQuery(PurposeQueries.getSingle(purposeId))
  const { data: riskAnalysis } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({ tenantKind: purpose?.consumer.kind })
  )

  if (!riskAnalysis || !purpose || !purposeTemplate || !purposeTemplate.purposeRiskAnalysisForm) {
    return null
  }

  const mergedDefaultAnswers = {
    ...purpose.riskAnalysisForm?.answers,
    ...purposeTemplate.purposeRiskAnalysisForm?.answers,
  } as Record<string, RiskAnalysisTemplateAnswer>

  const handleSubmit = (riskAnalysisFormSeed: RiskAnalysisFormSeed) => {
    // Convert RiskAnalysisFormTemplateSeed to RiskAnalysisFormSeed
    // Both have the same structure: { version: string, answers: any }
    const updatePurposePayload: PatchPurposeUpdateFromTemplateContent = {
      riskAnalysisForm: {
        version: riskAnalysisFormSeed.version,
        answers: riskAnalysisFormSeed.answers,
      },
    }

    updatePurposeFromTemplate(
      {
        purposeTemplateId,
        purposeId,
        riskAnalysisForm: updatePurposePayload.riskAnalysisForm,
      },
      {
        onSuccess: () => {
          // Navigate to summary or next step
          navigate('SUBSCRIBE_PURPOSE_SUMMARY', {
            params: { purposeId },
          })
        },
        onError: (error) => {
          console.error('Failed to update purpose from template:', error)
        },
      }
    )
  }

  return (
    <RiskAnalysisFormTemplate
      riskAnalysis={riskAnalysis}
      defaultAnswers={mergedDefaultAnswers}
      onSubmit={handleSubmit}
      onCancel={() => navigate('SUBSCRIBE_PURPOSE_LIST')}
    />
  )
}

export default PurposeFromTemplateEditStepRiskAnalysis

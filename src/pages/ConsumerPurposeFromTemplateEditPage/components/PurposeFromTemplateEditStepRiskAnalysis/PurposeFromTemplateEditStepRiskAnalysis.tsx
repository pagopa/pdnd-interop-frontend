import { PurposeQueries } from '@/api/purpose/purpose.queries'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { useParams, useNavigate } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { RiskAnalysisFormFromTemplate } from './RiskAnalysisForm/RiskAnalysisFormFromTemplate'
import type {
  RiskAnalysisTemplateAnswer,
  PatchPurposeUpdateFromTemplateContent,
} from '@/api/api.generatedTypes'
import React from 'react'
import { PurposeMutations } from '@/api/purpose/purpose.mutations'
import type { ActiveStepProps } from '@/hooks/useActiveStep'

const PurposeFromTemplateEditStepRiskAnalysis: React.FC<ActiveStepProps> = ({ back }) => {
  const { purposeTemplateId, purposeId } = useParams<'SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT'>()
  const navigate = useNavigate()
  const { mutate: updatePurposeFromTemplate } = PurposeMutations.useUpdateDraftFromPurposeTemplate()

  const { data: purposeTemplate } = useQuery(PurposeTemplateQueries.getSingle(purposeTemplateId))
  const { data: purpose } = useQuery(PurposeQueries.getSingle(purposeId))
  const { data: riskAnalysis } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({ tenantKind: purpose?.consumer.kind })
  )

  if (
    !riskAnalysis ||
    !purpose ||
    !purposeTemplate ||
    !purposeTemplate.purposeRiskAnalysisForm
  ) {
    return null
  }

  const purposeRiskAnalysisForm = purpose.riskAnalysisForm
  const purposeTemplateRiskAnalysisForm = purposeTemplate.purposeRiskAnalysisForm

  const templateAnswers = purposeTemplateRiskAnalysisForm.answers as Record<
    string,
    RiskAnalysisTemplateAnswer
  >
  const mergedDefaultAnswers = Object.entries(templateAnswers).reduce(
    (acc, [questionId, templateAnswer]) => {
      const purposeAnswerValues = purposeRiskAnalysisForm?.answers?.[questionId]

      acc[questionId] = {
        ...templateAnswer,
        values: purposeAnswerValues ?? templateAnswer.values,
      }
      return acc
    },
    {} as Record<string, RiskAnalysisTemplateAnswer>
  )

  const handleSubmit = (answers: Record<string, string[]>) => {
    const updatePurposePayload: PatchPurposeUpdateFromTemplateContent = {
      riskAnalysisForm: {
        version: '3.1', // todo fix this
        answers,
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
    <RiskAnalysisFormFromTemplate
      riskAnalysis={riskAnalysis}
      defaultAnswers={mergedDefaultAnswers}
      onSubmit={handleSubmit}
      onCancel={back}
    />
  )
}

export default PurposeFromTemplateEditStepRiskAnalysis

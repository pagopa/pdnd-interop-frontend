import { PurposeQueries } from '@/api/purpose/purpose.queries'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { useParams, useNavigate } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { RiskAnalysisFormFromTemplate } from './RiskAnalysisForm/RiskAnalysisFormFromTemplate'
import type {
  RiskAnalysisTemplateAnswer,
  PatchPurposeUpdateFromTemplateContent,
} from '@/api/api.generatedTypes'
import React, { useMemo } from 'react'
import { PurposeMutations } from '@/api/purpose/purpose.mutations'
import type { ActiveStepProps } from '@/hooks/useActiveStep'

type MergeResult = {
  mergedAnswers: Record<string, RiskAnalysisTemplateAnswer>
  suggestedValueConsumer: Record<string, string>
}

function isValueInSuggestedValues(savedValue: string, suggestedValues: string[]): boolean {
  return suggestedValues.includes(savedValue)
}

function mergeTemplateAndPurposeAnswers(
  templateAnswers: Record<string, RiskAnalysisTemplateAnswer>,
  purposeAnswers: Record<string, string[]>,
  questionsMap: Map<string, unknown>
): MergeResult {
  const mergedAnswers: Record<string, RiskAnalysisTemplateAnswer> = {}
  const suggestedValueConsumer: Record<string, string> = {}

  Object.entries(templateAnswers).forEach(([questionKey, templateAnswer]) => {
    const purposeAnswerValues = purposeAnswers[questionKey]
    const hasSuggestedValues = templateAnswer.suggestedValues?.length > 0

    if (hasSuggestedValues && purposeAnswerValues?.length > 0) {
      const savedValue = purposeAnswerValues[0]
      const isValueInSuggested = isValueInSuggestedValues(
        savedValue,
        templateAnswer.suggestedValues
      )

      mergedAnswers[questionKey] = {
        ...templateAnswer,
        values: isValueInSuggested ? [] : purposeAnswerValues,
      }

      if (isValueInSuggested) {
        suggestedValueConsumer[questionKey] = savedValue
      }
    } else {
      mergedAnswers[questionKey] = {
        ...templateAnswer,
        values: purposeAnswerValues ?? templateAnswer.values,
      }
    }
  })

  Object.entries(purposeAnswers).forEach(([questionKey, purposeAnswerValues]) => {
    if (!mergedAnswers[questionKey] && questionsMap.has(questionKey)) {
      mergedAnswers[questionKey] = {
        id: '',
        values: purposeAnswerValues,
        editable: true,
        suggestedValues: [],
      }
    }
  })

  return { mergedAnswers, suggestedValueConsumer }
}

const PurposeFromTemplateEditStepRiskAnalysis: React.FC<ActiveStepProps> = ({ back }) => {
  const { purposeTemplateId, purposeId } = useParams<'SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT'>()
  const navigate = useNavigate()
  const { mutate: updatePurposeFromTemplate } = PurposeMutations.useUpdateDraftFromPurposeTemplate()

  const { data: purposeTemplate } = useQuery(PurposeTemplateQueries.getSingle(purposeTemplateId))
  const { data: purpose } = useQuery(PurposeQueries.getSingle(purposeId))
  const { data: riskAnalysis } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({ tenantKind: purpose?.consumer.kind })
  )

  const { mergedAnswers, suggestedValueConsumer } = useMemo(() => {
    if (!riskAnalysis || !purpose || !purposeTemplate?.purposeRiskAnalysisForm) {
      return { mergedAnswers: {}, suggestedValueConsumer: {} }
    }

    const templateAnswers = purposeTemplate.purposeRiskAnalysisForm.answers as Record<
      string,
      RiskAnalysisTemplateAnswer
    >
    const purposeAnswers = purpose.riskAnalysisForm?.answers || {}
    const questionsMap = new Map(riskAnalysis.questions.map((q) => [q.id, q]))

    return mergeTemplateAndPurposeAnswers(templateAnswers, purposeAnswers, questionsMap)
  }, [riskAnalysis, purpose, purposeTemplate])

  if (!riskAnalysis || !purpose || !purposeTemplate?.purposeRiskAnalysisForm) {
    return null
  }

  const riskAnalysisVersion = purposeTemplate.purposeRiskAnalysisForm.version

  const handleSubmit = (answers: Record<string, string[]>) => {
    const updatePurposePayload: PatchPurposeUpdateFromTemplateContent = {
      riskAnalysisForm: {
        version: purpose.riskAnalysisForm?.version ?? riskAnalysisVersion,
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
      defaultAnswers={mergedAnswers}
      suggestedValueConsumer={suggestedValueConsumer}
      onSubmit={handleSubmit}
      onCancel={back}
    />
  )
}

export default PurposeFromTemplateEditStepRiskAnalysis

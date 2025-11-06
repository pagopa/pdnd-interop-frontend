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

  if (!riskAnalysis || !purpose || !purposeTemplate?.purposeRiskAnalysisForm) {
    return null
  }

  const purposeRiskAnalysisForm = purpose.riskAnalysisForm
  const purposeTemplateRiskAnalysisForm = purposeTemplate.purposeRiskAnalysisForm

  const templateAnswers = purposeTemplateRiskAnalysisForm.answers as Record<
    string,
    RiskAnalysisTemplateAnswer
  >

  // Crea una mappa delle domande per identificare quelle freeText con suggestedValues
  const questionsMap = new Map(riskAnalysis.questions.map((q) => [q.id, q]))

  // Merge delle risposte dal template e dal purpose
  const mergedDefaultAnswers = Object.entries(templateAnswers).reduce(
    (acc, [questionId, templateAnswer]) => {
      const purposeAnswerValues = purposeRiskAnalysisForm?.answers?.[questionId] as
        | string[]
        | undefined
      const hasSuggestedValues = templateAnswer.suggestedValues?.length > 0

      // Per domande freeText con suggestedValues, controlla se il valore salvato è uno dei suggestedValues
      if (hasSuggestedValues && purposeAnswerValues && purposeAnswerValues.length > 0) {
        const savedValue = purposeAnswerValues[0]
        const isValueInSuggested = templateAnswer.suggestedValues.includes(savedValue)

        acc[questionId] = {
          ...templateAnswer,
          // Se il valore salvato è uno dei suggestedValues, mantieni values vuoto (verrà usato suggestedValueConsumer)
          // Altrimenti, usa il valore salvato (è un valore custom)
          values: isValueInSuggested ? [] : purposeAnswerValues,
        }
      } else {
        // Per le altre domande, usa il valore dal purpose se esiste, altrimenti dal template
        acc[questionId] = {
          ...templateAnswer,
          values: purposeAnswerValues ?? templateAnswer.values,
        }
      }
      return acc
    },
    {} as Record<string, RiskAnalysisTemplateAnswer>
  )

  // Aggiungi le domande che sono solo nel purpose (non nel template) - tipicamente domande dipendenti
  const purposeAnswers = purposeRiskAnalysisForm?.answers || {}
  Object.entries(purposeAnswers).forEach(([questionId, purposeAnswerValues]) => {
    // Se la domanda non è nel template, aggiungila
    if (!mergedDefaultAnswers[questionId] && questionsMap.has(questionId)) {
      mergedDefaultAnswers[questionId] = {
        id: '', // Le domande dipendenti potrebbero non avere un id nel template
        values: purposeAnswerValues as string[],
        editable: true, // Le domande dipendenti sono sempre editabili
        suggestedValues: [],
      }
    }
  })

  // Crea l'oggetto suggestedValueConsumer per le domande freeText con suggestedValues
  const suggestedValueConsumer: Record<string, string> = {}
  Object.entries(mergedDefaultAnswers).forEach(([questionId, answer]) => {
    const purposeAnswerValues = purposeRiskAnalysisForm?.answers?.[questionId] as
      | string[]
      | undefined
    const hasSuggestedValues = answer.suggestedValues?.length > 0

    if (hasSuggestedValues && purposeAnswerValues && purposeAnswerValues.length > 0) {
      const savedValue = purposeAnswerValues[0]
      const isValueInSuggested = answer.suggestedValues.includes(savedValue)

      if (isValueInSuggested) {
        suggestedValueConsumer[questionId] = savedValue
      }
    }
  })

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
      suggestedValueConsumer={suggestedValueConsumer}
      onSubmit={handleSubmit}
      onCancel={back}
    />
  )
}

export default PurposeFromTemplateEditStepRiskAnalysis

import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { PurposeCreateFormValues } from './PurposeCreateEServiceForm'
import { useFormContext } from 'react-hook-form'
import { PurposeQueries } from '@/api/purpose'
import { Box, Typography } from '@mui/material'
import { SectionContainer } from '@/components/layout/containers'
import { EServiceQueries } from '@/api/eservice'

type QuestionItem = { question: string; answer: string; questionInfoLabel?: string }

export const PurposeCreateProviderRiskAnalysis: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'create' })
  const currentLanguage = useCurrentLanguage()
  const { watch } = useFormContext<PurposeCreateFormValues>()

  const selectedProviderPurposeId = watch('providerPurposeId')

  const selectedEServiceId = watch('eserviceId')
  // const { data: eservices } = EServiceQueries.useGetCatalogList(
  //   {
  //     agreementStates: ['ACTIVE'],
  //     // e-service might also be on 'DEPRECATED' state
  //     states: ['PUBLISHED'],
  //     limit: 50,
  //     offset: 0,
  //   },
  //   {
  //     suspense: false,
  //   }
  // )
  // const selectedEServiceDescriptorId = eservices?.results.find(
  //   (eservice) => eservice.id === selectedEServiceId
  // )?.activeDescriptor?.id
  // const { data: descriptor } = EServiceQueries.useGetDescriptorCatalog(
  //   selectedEServiceId!,
  //   selectedEServiceDescriptorId!,
  //   { suspense: false, enabled: !!selectedEServiceId && !!selectedEServiceDescriptorId }
  // )

  /**
   * TODO probabile soluzione
   * const riskAnalysis = GET /eservices/{eserviceId}/riskAnalysis/{riskAnalysisId}
   * eserviceId: selectedEServiceId - riskAnalysisId: selectedProviderPurposeId
   */
  // const riskAnalysisAnswers = riskAnalysis.answers

  // const { data: purpose } = PurposeQueries.useGetSingle(purposeId!, {
  //   suspense: false,
  //   enabled: !!purposeId,
  // })
  // const { data: riskAnalysisConfig } = PurposeQueries.useGetRiskAnalysisVersion(
  //   purpose?.riskAnalysisForm?.version as string,
  //   {
  //     suspense: false,
  //     enabled: !!purpose?.riskAnalysisForm?.version,
  //   }
  // )

  /**
   * TODO probabile versione da usare
   */
  // const { data: riskAnalysisConfig } = PurposeQueries.useGetRiskAnalysisVersion(
  //   riskAnalysis.version as string,
  //   {
  //     suspense: false,
  //     enabled: riskAnalysis.version,
  //   }
  // )

  // const riskAnalysisTemplate = purpose?.riskAnalysisForm?.answers

  const questions: Array<QuestionItem> = React.useMemo(() => {
    if (!riskAnalysisTemplate || !riskAnalysisConfig) return []

    // Answers in this form
    const answerIds = Object.keys(riskAnalysisTemplate)

    // Corresponding questions
    const questionsWithAnswer = riskAnalysisConfig.questions.filter(({ id }) =>
      answerIds.includes(id)
    )

    const answers = questionsWithAnswer.map(({ label, options, id, visualType, infoLabel }) => {
      const question = label[currentLanguage]

      const questionInfoLabel = infoLabel?.[currentLanguage]

      // Get the value of the answer
      // The value can be of three types: plain text, multiple options, single option
      const answerValue = riskAnalysisTemplate[id]

      // Plain text: this value comes from a text field
      if (visualType === 'text') {
        return { question, answer: answerValue[0] }
      }

      // Multiple options: this value comes from a multiple choice checkbox
      const selectedOptions = options?.filter(({ value }) => answerValue.includes(String(value)))
      const answer = selectedOptions?.map((o) => o.label[currentLanguage]).join(', ') ?? ''

      return { question, answer, questionInfoLabel }
    })

    return answers
  }, [riskAnalysisTemplate, riskAnalysisConfig, currentLanguage])

  if (!riskAnalysisTemplate) return null

  return (
    <SectionContainer newDesign innerSection title="Analisi del rischio">
      {questions.map(({ question, answer, questionInfoLabel }, i) => (
        <Box key={i}>
          <Typography variant="body2">{question}</Typography>
          {questionInfoLabel && (
            <Typography variant="caption" color="grey" component="p">
              {questionInfoLabel}
            </Typography>
          )}
          <Typography variant="body2" fontWeight={600} mt={0.5}>
            {answer}
          </Typography>
        </Box>
      ))}
      <Typography>{selectedProviderPurposeId}</Typography>
    </SectionContainer>
  )
}

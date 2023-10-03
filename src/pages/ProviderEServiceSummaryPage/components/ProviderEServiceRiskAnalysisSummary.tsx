import type { RiskAnalysisFormConfig } from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { useParams } from '@/router'
import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type QuestionItem = { question: string; answer: string; questionInfoLabel?: string }

type ProviderEServiceRiskAnalysisSummaryProps = {
  riskAnalysisTemplate: any
}

export const ProviderEServiceRiskAnalysisSummary: React.FC<
  ProviderEServiceRiskAnalysisSummaryProps
> = ({ riskAnalysisTemplate }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'summary.TODOriskAnalysisSummary' })
  const { t: tCommon } = useTranslation('common')
  const currentLanguage = useCurrentLanguage()
  // const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  // const { data: descriptor } = EServiceQueries.useGetDescriptorProvider(
  //   params.eserviceId,
  //   params.descriptorId
  // )

  // const { data: riskAnalysisConfig } = PurposeQueries.useGetRiskAnalysisVersion(
  //   purpose?.riskAnalysisForm?.version as string,
  //   {
  //     suspense: false,
  //     enabled: !!purpose?.riskAnalysisForm?.version,
  //   }
  // ) TODO per eservice
  const riskAnalysisConfig: RiskAnalysisFormConfig = {
    version: '1',
    questions: [],
  }

  // const riskAnalysisTemplate = /* descriptor?.eservice?.riskAnalysisForm?.answers */ undefined

  // if (!descriptor || !riskAnalysisTemplate) return null

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

  return (
    <>
      <Stack spacing={3}>
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
      </Stack>
    </>
  )
}

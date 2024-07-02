import { PurposeQueries } from '@/api/purpose'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { Alert, Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ConsumerPurposeSummaryRiskAnalysisAccordionProps = {
  purposeId: string
}

type QuestionItem = { question: string; answer: string; questionInfoLabel?: string }

export const ConsumerPurposeSummaryRiskAnalysisAccordion: React.FC<
  ConsumerPurposeSummaryRiskAnalysisAccordionProps
> = ({ purposeId }) => {
  const { data: purpose } = PurposeQueries.useGetSingle(purposeId)
  const { t } = useTranslation('purpose', { keyPrefix: 'summary.riskAnalysisSection' })
  const currentLanguage = useCurrentLanguage()

  const { data: riskAnalysisConfig } = PurposeQueries.useGetRiskAnalysisVersion(
    {
      riskAnalysisVersion: purpose!.riskAnalysisForm?.version as string,
      eserviceId: purpose!.eservice.id,
    },
    {
      suspense: false,
      enabled: !!purpose?.riskAnalysisForm?.version,
    }
  )

  const riskAnalysisTemplate = purpose?.riskAnalysisForm?.answers

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
        {purpose.riskAnalysisForm?.riskAnalysisId && (
          <Alert variant="outlined" severity="info">
            {t('providerRiskAnalysisAlert')}
          </Alert>
        )}
      </Stack>
    </>
  )
}

import { EServiceQueries } from '@/api/eservice'
import { PurposeQueries } from '@/api/purpose'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { SectionContainer } from '../layout/containers'

type RiskAnalysisInfoSummaryProps = {
  riskAnalysisId: string
  eServiceId: string
}

export const RiskAnalysisInfoSummary: React.FC<RiskAnalysisInfoSummaryProps> = ({
  riskAnalysisId,
  eServiceId,
}) => {
  type QuestionItem = { question: string; answer: string; questionInfoLabel?: string }

  const { t } = useTranslation('purpose', { keyPrefix: 'create.eserviceRiskAnalysisSection' })
  const currentLanguage = useCurrentLanguage()

  const { data: riskAnalysis } = useQuery({
    ...EServiceQueries.getEServiceRiskAnalysis(eServiceId!, riskAnalysisId!),
    enabled: Boolean(eServiceId && riskAnalysisId),
  })
  const riskAnalysisTemplate = riskAnalysis?.riskAnalysisForm.answers

  const { data: riskAnalysisConfig } = useQuery({
    ...PurposeQueries.getRiskAnalysisVersion({
      riskAnalysisVersion: riskAnalysis?.riskAnalysisForm.version as string,
      eserviceId: eServiceId!,
    }),
    enabled: Boolean(riskAnalysis?.riskAnalysisForm.version && eServiceId),
  })

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
    <SectionContainer innerSection title={t('riskAnalysis.title')}>
      <List>
        {questions.map(({ question, answer, questionInfoLabel }, i) => (
          <ListItem key={i} sx={{ pl: 0 }}>
            <ListItemText>
              <Typography variant="body2">{question}</Typography>
              {questionInfoLabel && (
                <Typography variant="caption" color="grey" component="p">
                  {questionInfoLabel}
                </Typography>
              )}
              <Typography variant="body2" fontWeight={600} mt={0.5}>
                {answer}
              </Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </SectionContainer>
  )
}

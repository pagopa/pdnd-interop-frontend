import type { Purpose } from '@/api/api.generatedTypes'
import { PurposeQueries } from '@/api/purpose'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import React from 'react'

type ConsumerPurposeSummaryRiskAnalysisAccordionProps = {
  purpose: Purpose
}

type QuestionItem = { question: string; answer: string; questionInfoLabel?: string }

export const ConsumerPurposeSummaryRiskAnalysisAccordion: React.FC<
  ConsumerPurposeSummaryRiskAnalysisAccordionProps
> = ({ purpose }) => {
  const currentLanguage = useCurrentLanguage()

  const { data: riskAnalysisConfig } = PurposeQueries.useGetRiskAnalysisVersion(
    purpose?.riskAnalysisForm?.version as string,
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
      <List>
        {questions.map(({ question, answer, questionInfoLabel }, i) => (
          <ListItem sx={{ pl: 0 }} key={i}>
            <ListItemText>
              <Typography variant="body2">{question}</Typography>
              {questionInfoLabel && (
                <Typography variant="caption" color="grey">
                  {questionInfoLabel}
                </Typography>
              )}
              <Typography variant="body2" fontWeight={600}>
                {answer}
              </Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  )
}

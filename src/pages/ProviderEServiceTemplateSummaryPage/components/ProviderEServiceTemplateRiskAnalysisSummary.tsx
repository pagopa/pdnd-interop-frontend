import { PurposeQueries } from '@/api/purpose'
import { TemplateQueries } from '@/api/template'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { useParams } from '@/router'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'

type QuestionItem = { question: string; answer: string; questionInfoLabel?: string }

type ProviderEServiceTemplateRiskAnalysisSummaryProps = {
  riskAnalysisId: string
}

export const ProviderEServiceTemplateRiskAnalysisSummary: React.FC<
  ProviderEServiceTemplateRiskAnalysisSummaryProps
> = ({ riskAnalysisId }) => {
  const currentLanguage = useCurrentLanguage()

  const params = useParams<'PROVIDE_ESERVICE_TEMPLATE_SUMMARY'>()

  const { data: template } = useSuspenseQuery(
    TemplateQueries.getSingle(params.eServiceTemplateId, params.eServiceTemplateVersionId)
  )

  const riskAnalysis = template?.eserviceTemplate.riskAnalysis.find(
    (item) => item.id === riskAnalysisId
  )

  const { data: riskAnalysisConfig } = useQuery({
    ...PurposeQueries.getRiskAnalysisVersion({
      riskAnalysisVersion: riskAnalysis?.riskAnalysisForm.version as string,
      eserviceId: template?.eserviceTemplate?.id as string,
    }),
    enabled: Boolean(riskAnalysis?.riskAnalysisForm.version && template?.eserviceTemplate?.id),
  })

  const riskAnalysisTemplate = riskAnalysis?.riskAnalysisForm.answers

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
    </>
  )
}

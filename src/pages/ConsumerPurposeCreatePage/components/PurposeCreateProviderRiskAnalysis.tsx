import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { PurposeCreateFormValues } from './PurposeCreateEServiceForm'
import { useFormContext } from 'react-hook-form'
import { PurposeQueries } from '@/api/purpose'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import { SectionContainer } from '@/components/layout/containers'
import { EServiceQueries } from '@/api/eservice'
import { useQuery } from '@tanstack/react-query'

type QuestionItem = { question: string; answer: string; questionInfoLabel?: string }

export const PurposeCreateProviderRiskAnalysis: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'create.eserviceRiskAnalysisSection' })
  const currentLanguage = useCurrentLanguage()
  const { watch } = useFormContext<PurposeCreateFormValues>()

  const selectedProviderRiskAnalysisId = watch('providerRiskAnalysisId')

  const selectedEServiceId = watch('eservice')?.id

  const { data: riskAnalysis } = useQuery({
    ...EServiceQueries.getEServiceRiskAnalysis(
      selectedEServiceId!,
      selectedProviderRiskAnalysisId!
    ),
    enabled: Boolean(selectedEServiceId && selectedProviderRiskAnalysisId),
  })
  const riskAnalysisTemplate = riskAnalysis?.riskAnalysisForm.answers

  const { data: riskAnalysisConfig } = useQuery({
    ...PurposeQueries.getRiskAnalysisVersion({
      riskAnalysisVersion: riskAnalysis?.riskAnalysisForm.version as string,
      eserviceId: selectedEServiceId!,
    }),
    enabled: Boolean(riskAnalysis?.riskAnalysisForm.version && selectedEServiceId),
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

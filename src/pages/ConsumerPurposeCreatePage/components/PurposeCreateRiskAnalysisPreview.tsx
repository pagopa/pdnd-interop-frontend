import React from 'react'
import { useFormContext } from 'react-hook-form'
import riskAnalysisConfig from '@/static/risk-analysis/pa/v2.0.json'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Box, Divider, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { Question } from '@/pages/ConsumerPurposeEditPage/types/risk-analysis.types'
import { PurposeQueries } from '@/api/purpose'
import { PurposeCreateFormValues } from './PurposeCreateEServiceForm'

type QuestionItem = { question: string; answer: string }

export const PurposeCreateRiskAnalysisPreview: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'create' })
  const currentLanguage = useCurrentLanguage()
  const { watch } = useFormContext<PurposeCreateFormValues>()
  const isUsingTemplate = watch('useTemplate')
  const purposeId = watch('templateId')

  const { data: purpose } = PurposeQueries.useGetSingle(purposeId!, {
    suspense: false,
    enabled: !!purposeId,
  })

  const riskAnalysisTemplate = purpose?.riskAnalysisForm.answers

  const questions: Array<QuestionItem> = React.useMemo(() => {
    if (!riskAnalysisTemplate || !isUsingTemplate) return []

    // Answers in this form
    const answerIds = Object.keys(riskAnalysisTemplate)

    // Corresponding questions
    const questionsWithAnswer = (riskAnalysisConfig.questions as Array<Question>).filter(({ id }) =>
      answerIds.includes(id)
    )

    const answers = questionsWithAnswer.map(({ label, options, id, type }) => {
      const question = label[currentLanguage]

      // Get the value of the answer
      // The value can be of three types: plain text, multiple options, single option
      const answerValue = riskAnalysisTemplate[id]

      // Plain text: this value comes from a text field
      if (type === 'text') {
        return { question, answer: answerValue[0] }
      }

      // Multiple options: this value comes from a multiple choice checkbox
      const selectedOptions = options?.filter(({ value }) => answerValue.includes(String(value)))
      const answer = selectedOptions?.map((o) => o.label[currentLanguage]).join(', ') ?? ''

      return { question, answer }
    })

    return answers
  }, [riskAnalysisTemplate, currentLanguage, isUsingTemplate])

  if (!riskAnalysisTemplate || !isUsingTemplate) return null

  return (
    <>
      <SectionContainer title={t('purposeInfoTitle')}>
        <DescriptionBlock label={t('purposeTitle')}>{purpose.title}</DescriptionBlock>
        <DescriptionBlock label={t('purposeDescription')}>{purpose.description}</DescriptionBlock>

        <Divider />

        <Typography sx={{ mt: 4, mb: 2 }} component="h2" variant="overline">
          Analisi del rischio
        </Typography>

        <List>
          {questions.map(({ question, answer }, i) => (
            <ListItem sx={{ pl: 0 }} key={i}>
              <ListItemText>
                <Typography fontWeight={600}>{question}</Typography>
                <Typography>{answer}</Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </SectionContainer>
    </>
  )
}

type DescriptionBlockProps = {
  children: React.ReactNode
  label: string
}

export const DescriptionBlock: React.FC<DescriptionBlockProps> = ({ children, label }) => {
  return (
    <Grid container sx={{ my: 4 }} columnSpacing={4}>
      <Grid item xs={3}>
        <Stack sx={{ mb: 1 }}>
          <Box>
            <Typography
              component="span"
              fontWeight={700}
              textTransform="uppercase"
              color="text.secondary"
              variant="body2"
            >
              {label}
            </Typography>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={9}>
        <Box>{children}</Box>
      </Grid>
    </Grid>
  )
}

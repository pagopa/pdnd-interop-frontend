import { EServiceQueries } from '@/api/eservice'
import { PurposeQueries } from '@/api/purpose'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { useParams } from '@/router'
import { URL_FRAGMENTS } from '@/router/router.utils'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import React from 'react'

type QuestionItem = { question: string; answer: string; questionInfoLabel?: string }

type ProviderEServiceRiskAnalysisSummaryProps = {
  riskAnalysisId: string
}

export const ProviderEServiceRiskAnalysisSummary: React.FC<
  ProviderEServiceRiskAnalysisSummaryProps
> = ({ riskAnalysisId }) => {
  const currentLanguage = useCurrentLanguage()

  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = EServiceQueries.useGetDescriptorProvider(
    params.eserviceId,
    params.descriptorId,
    {
      suspense: false,
      enabled: params.descriptorId !== URL_FRAGMENTS.FIRST_DRAFT,
    }
  )

  const { data: eservice } = EServiceQueries.useGetSingle(params.eserviceId, {
    suspense: false,
    enabled: params.descriptorId === URL_FRAGMENTS.FIRST_DRAFT,
  })

  const riskAnalysis = descriptor
    ? descriptor?.eservice.riskAnalysis.find((item) => item.id === riskAnalysisId)
    : eservice?.riskAnalysis.find((item) => item.id === riskAnalysisId)

  const { data: riskAnalysisConfig } = PurposeQueries.useGetRiskAnalysisVersion(
    {
      riskAnalysisVersion: riskAnalysis?.riskAnalysisForm.version as string,
      eserviceId: eservice?.id as string,
    },
    {
      suspense: false,
      enabled: !!riskAnalysis?.riskAnalysisForm.version && !!eservice?.id,
    }
  )

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

  if ((!descriptor && !eservice) || !riskAnalysisTemplate) return null

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

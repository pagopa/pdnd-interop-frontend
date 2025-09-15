import { PurposeQueries } from '@/api/purpose'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { SectionContainer } from '../layout/containers'
import type {
  EServiceTemplateRiskAnalysis,
  Purpose,
  RiskAnalysisForm,
  RiskAnalysisFormConfig,
} from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'
import type { PurposeTemplate } from '@/api/purposeTemplate/mockedResponses'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'

type RiskAnalysisInfoSummaryProps = {
  riskAnalysisConfig: RiskAnalysisFormConfig
  riskAnalysisForm: RiskAnalysisForm
}

type EServiceRiskAnalysisInfoSummaryProps = {
  eserviceId: string
  riskAnalysisId: string
}

type EServiceTemplateRiskAnalysisInfoSummaryProps = {
  eserviceTemplateRiskAnalysis: EServiceTemplateRiskAnalysis
}

type PurposeRiskAnalysisInfoSummaryProps = {
  purpose: Purpose
}

type PurposeTemplateRiskAnalysisInfoSummaryProps = {
  purposeTemplate: PurposeTemplate
}

const RiskAnalysisInfoSummary: React.FC<RiskAnalysisInfoSummaryProps> = ({
  riskAnalysisConfig,
  riskAnalysisForm,
}) => {
  type QuestionItem = { question: string; answer: string; questionInfoLabel?: string }

  const { t } = useTranslation('purpose', { keyPrefix: 'create.eserviceRiskAnalysisSection' })
  const currentLanguage = useCurrentLanguage()

  const questions: Array<QuestionItem> = React.useMemo(() => {
    // Answers in this form
    const answerIds = Object.keys(riskAnalysisForm.answers)

    // Corresponding questions
    const questionsWithAnswer = riskAnalysisConfig.questions.filter(({ id }) =>
      answerIds.includes(id)
    )

    const answers = questionsWithAnswer.map(({ label, options, id, visualType, infoLabel }) => {
      const question = label[currentLanguage]

      const questionInfoLabel = infoLabel?.[currentLanguage]

      // Get the value of the answer
      // The value can be of three types: plain text, multiple options, single option
      const answerValue = riskAnalysisForm.answers[id]

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
  }, [riskAnalysisForm, riskAnalysisConfig, currentLanguage])

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

export const EServiceRiskAnalysisInfoSummary: React.FC<EServiceRiskAnalysisInfoSummaryProps> = ({
  eserviceId,
  riskAnalysisId,
}) => {
  const { data: riskAnalysis } = useQuery(
    EServiceQueries.getEServiceRiskAnalysis(eserviceId, riskAnalysisId)
  )
  const riskAnalysisForm = riskAnalysis?.riskAnalysisForm

  const riskAnalysisVersion = riskAnalysis?.riskAnalysisForm.version

  const { data: riskAnalysisConfig } = useQuery({
    ...PurposeQueries.getRiskAnalysisVersion({
      riskAnalysisVersion: riskAnalysisVersion as string,
      eserviceId: eserviceId,
    }),
    enabled: Boolean(riskAnalysisVersion),
  })

  if (!riskAnalysisForm || !riskAnalysisConfig) return null

  return (
    <RiskAnalysisInfoSummary
      riskAnalysisConfig={riskAnalysisConfig}
      riskAnalysisForm={riskAnalysisForm}
    />
  )
}

export const EServiceTemplateRiskAnalysisInfoSummary: React.FC<
  EServiceTemplateRiskAnalysisInfoSummaryProps
> = ({ eserviceTemplateRiskAnalysis }) => {
  const { data: riskAnalysisConfig } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({
      tenantKind: eserviceTemplateRiskAnalysis.tenantKind,
    })
  )

  if (!riskAnalysisConfig) return null
  return (
    <RiskAnalysisInfoSummary
      riskAnalysisConfig={riskAnalysisConfig}
      riskAnalysisForm={eserviceTemplateRiskAnalysis.riskAnalysisForm}
    />
  )
}

export const PurposeRiskAnalysisInfoSummary: React.FC<PurposeRiskAnalysisInfoSummaryProps> = ({
  purpose,
}) => {
  const riskAnalysisForm = purpose.riskAnalysisForm

  const riskAnalysisVersion = purpose.riskAnalysisForm?.version

  const { data: riskAnalysisConfig } = useQuery({
    ...PurposeQueries.getRiskAnalysisVersion({
      riskAnalysisVersion: riskAnalysisVersion as string,
      eserviceId: purpose.eservice.id,
    }),
    enabled: Boolean(riskAnalysisVersion),
  })

  if (!riskAnalysisConfig || !riskAnalysisForm) return null
  return (
    <RiskAnalysisInfoSummary
      riskAnalysisConfig={riskAnalysisConfig}
      riskAnalysisForm={riskAnalysisForm}
    />
  )
}

export const PurposeTemplateRiskAnalysisInfoSummary: React.FC<
  PurposeTemplateRiskAnalysisInfoSummaryProps
> = ({ purposeTemplate }) => {
  const riskAnalysisForm = purposeTemplate.purposeRiskAnalysisForm

  const riskAnalysisVersion = purposeTemplate.purposeRiskAnalysisForm.version

  // const { data: riskAnalysisConfig } = useQuery({  TODO: THERE WILL BE AN API CALL?
  //   ...PurposeTemplateQueries.getRiskAnalysisVersion({
  //     riskAnalysisVersion: riskAnalysisVersion as string,
  //     //eserviceId: purposeTemplate.,
  //   }),
  //   enabled: Boolean(riskAnalysisVersion),
  // })

  //if (!riskAnalysisConfig || !riskAnalysisForm) return null
  return (
    // <RiskAnalysisInfoSummary
    //   riskAnalysisConfig={riskAnalysisConfig}
    //   riskAnalysisForm={riskAnalysisForm}
    // />
    <>TO DO</>
  )
}

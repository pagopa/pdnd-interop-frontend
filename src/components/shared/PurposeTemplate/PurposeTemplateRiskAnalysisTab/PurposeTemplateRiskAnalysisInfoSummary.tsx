import { PurposeQueries } from '@/api/purpose'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type {
  PurposeTemplateWithCompactCreator,
  RiskAnalysisFormConfig,
  RiskAnalysisFormTemplate,
  RiskAnalysisTemplateAnswerAnnotation,
} from '@/api/api.generatedTypes'
import { riskAnalysisConfigMock, riskAnalysisFormMock } from '@/api/purposeTemplate/mockedResponses'
import { SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import DownloadIcon from '@mui/icons-material/Download'

type RiskAnalysisInfoSummaryProps = {
  riskAnalysisConfig: RiskAnalysisFormConfig
  riskAnalysisForm: RiskAnalysisFormTemplate
}

type PurposeTemplateRiskAnalysisInfoSummaryProps = {
  purposeTemplate: PurposeTemplateWithCompactCreator
}

const RiskAnalysisInfoSummary: React.FC<RiskAnalysisInfoSummaryProps> = ({
  riskAnalysisConfig,
  riskAnalysisForm,
}) => {
  type QuestionItem = {
    question: string
    answer: string
    isEditable: boolean
    questionInfoLabel?: string
    annotations?: RiskAnalysisTemplateAnswerAnnotation
  }

  const { t } = useTranslation('shared-components', {
    keyPrefix: 'purposeTemplateRiskAnalysisInfoSummary',
  })

  const panelContentId = React.useId()
  const headerId = React.useId()

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

      const annotations = riskAnalysisForm.answers[id].annotation

      const isEditable = riskAnalysisForm.answers[id].editable

      // Get the value of the answer
      // The value can be of three types: plain text, multiple options, single option
      const answerValue = riskAnalysisForm.answers[id].values

      // Plain text: this value comes from a text field
      if (visualType === 'text') {
        return {
          question,
          answer: answerValue[0],
          isEditable: riskAnalysisForm.answers[id].editable ?? false, //TODO: CHECK WHEN BE IS READY
          questionInfoLabel,
          annotations,
        }
      }

      // Multiple options: this value comes from a multiple choice checkbox
      const selectedOptions = options?.filter(({ value }) => answerValue.includes(String(value)))
      const answer = selectedOptions?.map((o) => o.label[currentLanguage]).join(', ') ?? ''

      return { question, answer, questionInfoLabel, annotations, isEditable }
    })

    return answers
  }, [riskAnalysisForm, riskAnalysisConfig, currentLanguage])

  const [hasExpandedOnce, setHasExpandedOnce] = React.useState(false)

  return (
    <SectionContainer innerSection>
      <List>
        {questions.map(({ question, answer, questionInfoLabel, annotations, isEditable }, i) => (
          <SectionContainer
            innerSection
            key={i}
            sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
          >
            <ListItem key={i} sx={{ pl: 0 }}>
              <ListItemText>
                <Typography variant="body2" fontWeight={600}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <span>{question}</span>
                    {!isEditable && (
                      <Chip
                        size="small"
                        label={t('notEditableLabel')}
                        color="default"
                        sx={{ borderRadius: 1 }}
                      />
                    )}
                  </Box>
                </Typography>

                {questionInfoLabel && (
                  <Typography variant="caption" color="grey" component="p">
                    {questionInfoLabel}
                  </Typography>
                )}
                <Typography variant="body2" fontWeight={600} mt={2}>
                  {t('answerLabel')}
                  <span style={{ fontWeight: 400 }}>{answer ? answer : '-'}</span>
                </Typography>
                {annotations && (
                  <>
                    <Accordion
                      sx={{
                        '&:before': { display: 'none' },
                      }}
                    >
                      <AccordionSummary
                        onClick={() => setHasExpandedOnce(true)}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={panelContentId}
                        id={headerId}
                        sx={{
                          '& .MuiAccordionSummary-expandIconWrapper': {
                            color: 'primary.main',
                            mr: '84%',
                          },
                        }}
                      >
                        <Typography fontWeight={700} sx={{ color: 'primary.main' }}>
                          {t('annotationSection.readAnnotationBtnLabel')}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {hasExpandedOnce && <AnnotationDetails annotation={annotations} />}
                      </AccordionDetails>
                    </Accordion>
                  </>
                )}
              </ListItemText>
            </ListItem>
          </SectionContainer>
        ))}
      </List>
    </SectionContainer>
  )
}

export const PurposeTemplateRiskAnalysisInfoSummary: React.FC<
  PurposeTemplateRiskAnalysisInfoSummaryProps
> = ({ purposeTemplate }) => {
  const riskAnalysisForm = purposeTemplate.purposeRiskAnalysisForm

  const riskAnalysisVersion = purposeTemplate.purposeRiskAnalysisForm?.version

  const { data: riskAnalysisConfig } = useQuery({
    ...PurposeQueries.getRiskAnalysisVersion({
      riskAnalysisVersion: riskAnalysisVersion as string,
      eserviceId: '4aae1b6f-eca9-4636-b6e3-6ae0ddf9aac4', // TO DO: purposeTemplate.eservice.id is not available in the current type
    }),
    enabled: Boolean(riskAnalysisVersion),
  })

  if (!riskAnalysisConfig || !riskAnalysisForm) return null
  return (
    <RiskAnalysisInfoSummary
      // riskAnalysisConfig={riskAnalysisConfig}
      // riskAnalysisForm={riskAnalysisForm}
      riskAnalysisConfig={riskAnalysisConfigMock}
      riskAnalysisForm={riskAnalysisFormMock}
    />
  )
}

const AnnotationDetails: React.FC<{ annotation: RiskAnalysisTemplateAnswerAnnotation }> = ({
  annotation,
}) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'purposeTemplateRiskAnalysisInfoSummary.annotationSection',
  })

  return (
    <SectionContainer
      innerSection
      title={t('title')}
      sx={{ backgroundColor: 'grey.50', p: 3, fontWeight: 700 }}
    >
      <Stack sx={{ mt: 1 }} spacing={2}>
        <Typography variant="body2">{annotation.text}</Typography>
        {annotation.docs && annotation.docs.length > 0 && (
          <Stack>
            {annotation.docs.map((doc) => (
              <Button
                key={doc.id}
                endIcon={<DownloadIcon fontSize="small" />}
                component="button"
                onClick={() => {}} // TODO: handle download
                sx={{ fontWeight: 700, alignSelf: 'flex-start' }}
              >
                {doc.prettyName}
              </Button>
            ))}
          </Stack>
        )}
      </Stack>
    </SectionContainer>
  )
}

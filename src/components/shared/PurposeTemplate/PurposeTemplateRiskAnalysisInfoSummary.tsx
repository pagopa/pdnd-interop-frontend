import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material'
import React from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type {
  PurposeTemplateWithCompactCreator,
  RiskAnalysisFormConfig,
  RiskAnalysisFormTemplate,
  RiskAnalysisTemplateAnswerAnnotation,
} from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { AnnotationDetails } from './AnnotationDetails'

type PurposeTemplateRiskAnalysisInfoSummaryProps = {
  riskAnalysisConfig: RiskAnalysisFormConfig
  riskAnalysisForm: RiskAnalysisFormTemplate
  purposeTemplate: PurposeTemplateWithCompactCreator
}

const RiskAnalysisInfoSummary: React.FC<PurposeTemplateRiskAnalysisInfoSummaryProps> = ({
  riskAnalysisConfig,
  riskAnalysisForm,
  purposeTemplate,
}) => {
  type QuestionItem = {
    question: string
    answer: string
    isEditable: boolean
    questionInfoLabel?: string
    annotations?: RiskAnalysisTemplateAnswerAnnotation
    answerId: string
    suggestedValues: string[]
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

      const currentAnswer = riskAnalysisForm.answers[id]

      const annotations = currentAnswer.annotation

      const isEditable = Boolean(currentAnswer.editable)

      const suggestedValues = currentAnswer.suggestedValues ?? []

      // Plain text: this value comes from a text field
      if (visualType === 'text') {
        return {
          question,
          answer: currentAnswer.values[0],
          isEditable,
          questionInfoLabel,
          annotations,
          suggestedValues,
          answerId: currentAnswer.id,
        }
      }

      // Multiple options: this value comes from a multiple choice checkbox
      const selectedOptions = options?.filter(({ value }) =>
        currentAnswer.values.includes(String(value))
      )
      const answer = selectedOptions?.map((o) => o.label[currentLanguage]).join(', ') ?? ''

      return {
        question,
        answer,
        questionInfoLabel,
        annotations,
        isEditable,
        suggestedValues,
        answerId: riskAnalysisForm.answers[id].id,
      }
    })

    return answers
  }, [riskAnalysisForm, riskAnalysisConfig, currentLanguage])

  const [hasExpandedOnce, setHasExpandedOnce] = React.useState(false)

  return (
    <SectionContainer innerSection>
      <List>
        {questions.map(
          (
            {
              question,
              answer,
              questionInfoLabel,
              annotations,
              isEditable,
              answerId,
              suggestedValues,
            },
            i
          ) => (
            <SectionContainer
              innerSection
              key={i}
              sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
            >
              <ListItem key={i} sx={{ pl: 0 }}>
                <ListItemText>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      gap={2}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <span>{question}</span>
                      </Box>
                      {!isEditable && suggestedValues.length === 0 && (
                        <Tooltip title={t('notEditableTooltip')} arrow>
                          <Chip
                            size="small"
                            label={t('notEditableLabel')}
                            color="default"
                            sx={{
                              borderRadius: 1,
                              flexShrink: 0,
                              whiteSpace: 'nowrap',
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </Typography>

                  {questionInfoLabel && (
                    <Typography variant="caption" color="grey" component="p">
                      {questionInfoLabel}
                    </Typography>
                  )}
                  <Typography variant="body2" fontWeight={600} mt={2}>
                    {suggestedValues && suggestedValues.length > 0
                      ? t('suggestedValuesSection.title')
                      : t('answerLabel')}
                    <span style={{ fontWeight: 400 }}>
                      {answer ? (
                        answer
                      ) : suggestedValues.length > 0 ? (
                        <SuggestedValuesSection suggestedValues={suggestedValues} />
                      ) : (
                        '-'
                      )}
                    </span>
                  </Typography>
                  {annotations && (
                    <>
                      <Accordion
                        sx={{
                          '&:before': { display: 'none' },
                          boxShadow: 'none',
                          mt: 0, // no top margin before accordion
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          onClick={() => setHasExpandedOnce(true)}
                          aria-controls={panelContentId}
                          id={headerId}
                          sx={{
                            px: 0,
                            py: 0,
                            justifyContent: 'flex-start',
                            '& .MuiAccordionSummary-content': {
                              display: 'flex',
                              flex: 'none',
                            },
                            '& .MuiAccordionSummary-expandIconWrapper': {
                              color: 'primary.main',
                              marginLeft: 0,
                              marginRight: 0,
                              order: 2,
                            },
                          }}
                        >
                          <Typography
                            fontWeight={700}
                            sx={{
                              color: 'primary.main',
                              whiteSpace: 'nowrap',
                              order: 1,
                            }}
                          >
                            {t('annotationSection.readAnnotationBtnLabel')}
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails
                          sx={{
                            px: 0,
                            py: 0,
                          }}
                        >
                          {hasExpandedOnce && annotations && (
                            <AnnotationDetails
                              annotation={annotations}
                              purposeTemplateId={purposeTemplate.id}
                              answerId={answerId}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>
                    </>
                  )}
                </ListItemText>
              </ListItem>
            </SectionContainer>
          )
        )}
      </List>
    </SectionContainer>
  )
}

export const PurposeTemplateRiskAnalysisInfoSummary: React.FC<
  PurposeTemplateRiskAnalysisInfoSummaryProps
> = ({ purposeTemplate, riskAnalysisConfig, riskAnalysisForm }) => {
  const { t: tPurposeTemplate } = useTranslation('purposeTemplate', {
    keyPrefix: 'read.riskAnalysisTab',
  })

  const title =
    purposeTemplate.targetTenantKind === 'PA'
      ? tPurposeTemplate('titlePA')
      : tPurposeTemplate('titleNotPA')

  if (!riskAnalysisConfig || !riskAnalysisForm) return null
  return (
    <SectionContainer
      title={title}
      sx={{
        backgroundColor: 'paper.main',
      }}
    >
      <RiskAnalysisInfoSummary
        riskAnalysisConfig={riskAnalysisConfig}
        riskAnalysisForm={riskAnalysisForm}
        purposeTemplate={purposeTemplate}
      />
    </SectionContainer>
  )
}

const SuggestedValuesSection: React.FC<{
  suggestedValues: string[]
}> = ({ suggestedValues }) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'purposeTemplateRiskAnalysisInfoSummary.suggestedValuesSection',
  })
  return (
    <Box>
      <List sx={{ pl: 3, listStyleType: 'disc', listStylePosition: 'initial' }}>
        {suggestedValues.map((value, index) => (
          <ListItem
            key={index}
            sx={{
              p: 0,
              display: 'list-item',
            }}
          >
            <ListItemText
              primary={`${t('option', { index: index + 1 })} ${value}`}
              sx={{
                margin: 0,
                paddingLeft: 0,
                '& .MuiTypography-root': { fontWeight: 400 },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

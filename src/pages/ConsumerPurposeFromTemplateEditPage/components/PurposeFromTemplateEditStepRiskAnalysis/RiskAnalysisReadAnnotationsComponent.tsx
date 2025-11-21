import { useTranslation } from 'react-i18next'
import { Typography, Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import type { RiskAnalysisTemplateAnswerAnnotation } from '@/api/api.generatedTypes'
import { useParams } from '@/router'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { AnnotationDetails } from '@/components/shared/PurposeTemplate/AnnotationDetails'

export const RiskAnalysisReadAnnotationsComponent: React.FC<{
  questionKey: string
}> = ({ questionKey }) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'purposeTemplateRiskAnalysisInfoSummary',
  })
  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_TEMPLATE_EDIT'>()

  const { watch } = useFormContext()

  const annotation: RiskAnalysisTemplateAnswerAnnotation | undefined = watch(
    `annotations.${questionKey}`
  )

  const answerId: string | undefined = watch(`answerIds.${questionKey}`)

  const [hasExpandedOnce, setHasExpandedOnce] = React.useState(false)
  const panelContentId = React.useId()
  const headerId = React.useId()

  return (
    <>
      {annotation?.text && (
        <Accordion
          sx={{
            '&:before': { display: 'none' },
            boxShadow: 'none',
            mt: 0,
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
            {hasExpandedOnce && annotation && answerId && (
              <AnnotationDetails
                annotation={annotation}
                purposeTemplateId={purposeTemplateId}
                answerId={answerId}
              />
            )}
          </AccordionDetails>
        </Accordion>
      )}
    </>
  )
}

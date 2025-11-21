import type { EServiceDoc, RiskAnalysisTemplateAnswerAnnotation } from '@/api/api.generatedTypes'
import { PurposeTemplateDownloads } from '@/api/purposeTemplate/purposeTemplate.downloads'
import { SectionContainer } from '@/components/layout/containers'
import { getDownloadDocumentName } from '@/utils/purposeTemplate.utils'
import DownloadIcon from '@mui/icons-material/Download'
import { Button, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useTranslation } from 'react-i18next'

export const AnnotationDetails: React.FC<{
  annotation: RiskAnalysisTemplateAnswerAnnotation
  purposeTemplateId: string
  answerId: string
}> = ({ annotation, purposeTemplateId, answerId }) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'purposeTemplateRiskAnalysisInfoSummary.annotationSection',
  })

  const downloadDocument = PurposeTemplateDownloads.useDownloadDocument()

  const handleDownload = (doc: EServiceDoc) => {
    downloadDocument(
      {
        purposeTemplateId,
        answerId,
        documentId: doc.id,
      },
      getDownloadDocumentName(doc)
    )
  }

  return (
    <SectionContainer
      innerSection
      title={t('title')}
      sx={{ backgroundColor: 'grey.50', p: 3, fontWeight: 700 }}
    >
      <Stack spacing={2}>
        <Typography variant="body2">{annotation.text}</Typography>
        {annotation.docs && annotation.docs.length > 0 && (
          <Stack spacing={1}>
            {annotation.docs.map((doc) => (
              <Button
                key={doc.id}
                endIcon={<DownloadIcon fontSize="small" />}
                component="button"
                onClick={() => handleDownload(doc)}
                sx={{
                  fontWeight: 700,
                  alignSelf: 'flex-start',
                  p: 0,
                }}
                disableRipple
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

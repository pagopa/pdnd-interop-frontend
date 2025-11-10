import type { RiskAnalysisTemplateAnswerAnnotation } from '@/api/api.generatedTypes'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import { SectionContainer } from '@/components/layout/containers'
import { Typography, Button } from '@mui/material'
import { Stack } from '@mui/system'
import { useTranslation } from 'react-i18next'
import DownloadIcon from '@mui/icons-material/Download'

export const AnnotationDetails: React.FC<{
  annotation: RiskAnalysisTemplateAnswerAnnotation
  purposeTemplateId: string
  answerId: string
}> = ({ annotation, purposeTemplateId, answerId }) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'purposeTemplateRiskAnalysisInfoSummary.annotationSection',
  })

  const { mutate: downloadDocument, isPending: isDownloading } =
    PurposeTemplateMutations.useDownloadDocument()

  const handleDownload = (documentId: string, fileName: string) => {
    downloadDocument(
      {
        purposeTemplateId,
        answerId,
        documentId,
      },
      {
        onSuccess: (fileBlob) => {
          // Create a download link
          const url = window.URL.createObjectURL(fileBlob)
          const link = document.createElement('a')
          link.href = url
          link.download = fileName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        },
      }
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
                onClick={() => handleDownload(doc.id, doc.prettyName)}
                disabled={isDownloading}
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

import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { Stack } from '@mui/material'
import type {
  PurposeTemplateWithCompactCreator,
  RiskAnalysisTemplateAnswerAnnotationDocument,
} from '@/api/api.generatedTypes'
import { PurposeTemplateDownloads } from '@/api/purposeTemplate/purposeTemplate.downloads'
import { getDownloadDocumentName } from '@/utils/purposeTemplate.utils'
import { IconLink } from '../../IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'

type PurposeTemplateDocumentationSectionProps = {
  purposeTemplate: PurposeTemplateWithCompactCreator
}

export const PurposeTemplateDocumentationSection: React.FC<
  PurposeTemplateDocumentationSectionProps
> = ({ purposeTemplate }) => {
  const { t } = useTranslation('purposeTemplate', {
    keyPrefix: 'read.detailsTab.sections.documentation',
  })

  const downloadDocument = PurposeTemplateDownloads.useDownloadDocument()

  const handleDownload = (doc: RiskAnalysisTemplateAnswerAnnotationDocument, answerId: string) => {
    downloadDocument(
      {
        purposeTemplateId: purposeTemplate.id,
        answerId,
        documentId: doc.id,
      },
      getDownloadDocumentName(doc)
    )
  }

  const answers = purposeTemplate.purposeRiskAnalysisForm?.answers as
    | Record<
        string,
        {
          id: string
          annotation?: { docs?: RiskAnalysisTemplateAnswerAnnotationDocument[] }
        }
      >
    | undefined

  const documents = answers
    ? Object.values(answers).flatMap((answer) =>
        (answer.annotation?.docs || []).map((doc) => ({ doc, answerId: answer.id }))
      )
    : []

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        <InformationContainer
          label={t('documentsLabel')}
          content={
            documents.length > 0 ? (
              <Stack spacing={2} direction="column">
                {documents.map(({ doc, answerId }) => (
                  <IconLink
                    key={doc.id}
                    component="button"
                    onClick={handleDownload.bind(null, doc, answerId)}
                    startIcon={<AttachFileIcon fontSize="small" />}
                  >
                    {doc.prettyName}
                  </IconLink>
                ))}
              </Stack>
            ) : (
              '-'
            )
          }
        />
      </Stack>
    </SectionContainer>
  )
}

export const PurposeTemplateDocumentationSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}

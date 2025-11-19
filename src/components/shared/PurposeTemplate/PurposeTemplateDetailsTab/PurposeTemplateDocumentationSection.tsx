import React, { useMemo } from 'react'
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

  const documentToAnswerIdMap = useMemo(() => {
    const map = new Map<string, string>()
    const answers = purposeTemplate.purposeRiskAnalysisForm?.answers as
      | Record<
          string,
          {
            id: string
            annotation?: { docs?: RiskAnalysisTemplateAnswerAnnotationDocument[] }
          }
        >
      | undefined

    if (answers) {
      Object.values(answers).forEach((answer) => {
        answer.annotation?.docs?.forEach((doc) => {
          map.set(doc.id, answer.id)
        })
      })
    }

    return map
  }, [purposeTemplate.purposeRiskAnalysisForm?.answers])

  const handleDownload = (doc: RiskAnalysisTemplateAnswerAnnotationDocument) => {
    const answerId = documentToAnswerIdMap.get(doc.id)
    if (!answerId) {
      console.error('Could not find answerId for document:', doc.id)
      return
    }

    downloadDocument(
      {
        purposeTemplateId: purposeTemplate.id,
        answerId,
        documentId: doc.id,
      },
      getDownloadDocumentName(doc)
    )
  }

  const documentation = purposeTemplate.annotationDocuments

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        <InformationContainer
          label={t('documentsLabel')}
          content={
            documentation && documentation.length > 0 ? (
              <Stack spacing={2} direction="column">
                {documentation.map((doc) => (
                  <IconLink
                    key={doc.id}
                    component="button"
                    onClick={handleDownload.bind(null, doc)}
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

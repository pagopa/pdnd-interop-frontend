import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { Stack } from '@mui/material'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
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

  const documentation = purposeTemplate.annotationDocuments

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        <InformationContainer
          label={t('documentsLabel')}
          content={
            documentation && documentation.length ? (
              <>
                {documentation.map((doc) => (
                  <IconLink
                    key={doc.id}
                    href={doc.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="none"
                    startIcon={<AttachFileIcon fontSize="small" />}
                  >
                    {doc.prettyName}
                  </IconLink>
                ))}
              </>
            ) : (
              '-'
            )
          }
        />
        <InformationContainer label={t('usefulLink')} content={'TO DO'} />
      </Stack>
    </SectionContainer>
  )
}

export const PurposeTemplateDocumentationSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}

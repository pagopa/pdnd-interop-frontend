import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import type { PurposeTemplate } from '@/api/purposeTemplate/mockedResponses'
import { Stack } from '@mui/material'

type PurposeTemplateDocumentationSectionProps = {
  purposeTemplate: PurposeTemplate
}

export const PurposeTemplateDocumentationSection: React.FC<
  PurposeTemplateDocumentationSectionProps
> = ({ purposeTemplate }) => {
  const { t } = useTranslation('purposeTemplate', {
    keyPrefix: 'read.detailsTab.sections.documentation',
  })

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        <InformationContainer label={t('documentsLabel')} content={'TO DO'} />
        <InformationContainer label={t('usefulLink')} content={'TO DO'} />
      </Stack>
    </SectionContainer>
  )
}

export const PurposeTemplateDocumentationSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}

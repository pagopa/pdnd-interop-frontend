import React from 'react'
import { useTranslation } from 'react-i18next'
import { SectionContainer } from '@/components/layout/containers'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
import {
  ConsumerPurposeTemplateLinkedEServiceTableSkeleton,
  ConsumerPurposeTemplateLinkedEServiceTable,
} from '@/components/shared/PurposeTemplate/PurposeTemplateLinkedEServiceTab/ConsumerPurposeTemplateLinkedEServiceTable'

type ConsumerPurposeTemplateCatalogLinkedEServiceTabProps = {
  purposeTemplate: PurposeTemplateWithCompactCreator
}

export const ConsumerPurposeTemplateCatalogLinkedEServiceTab: React.FC<
  ConsumerPurposeTemplateCatalogLinkedEServiceTabProps
> = ({ purposeTemplate }) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'read.linkedEservicesTab' })

  const descriptionLabel = t('description')
    .split('\n')
    .map((line, idx) => (
      <span key={idx}>
        {line}
        <br />
      </span>
    ))

  return (
    <>
      <SectionContainer
        title={t('title')}
        description={descriptionLabel}
        sx={{
          backgroundColor: 'transparent',
        }}
      >
        <React.Suspense fallback={<ConsumerPurposeTemplateLinkedEServiceTableSkeleton />}>
          <ConsumerPurposeTemplateLinkedEServiceTable purposeTemplate={purposeTemplate} />
        </React.Suspense>
      </SectionContainer>
    </>
  )
}

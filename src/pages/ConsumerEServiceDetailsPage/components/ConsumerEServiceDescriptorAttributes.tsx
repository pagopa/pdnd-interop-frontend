import { EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { ReadOnlyDescriptorAttributes } from '@/components/shared/ReadOnlyDescriptorAttributes'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ConsumerEServiceDescriptorAttributes: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.sections.attributes' })

  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { data: descriptorAttributes } = useSuspenseQuery({
    ...EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId),
    select: (d) => d.attributes,
  })

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <ReadOnlyDescriptorAttributes descriptorAttributes={descriptorAttributes} />
    </SectionContainer>
  )
}

export const ConsumerEServiceDescriptorAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={1000} />
}

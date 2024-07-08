import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { ReadOnlyDescriptorAttributes } from '@/components/shared/ReadOnlyDescriptorAttributes'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ConsumerEServiceDescriptorAttributes: React.FC<{
  descriptor: CatalogEServiceDescriptor
}> = ({ descriptor }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.sections.attributes' })

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <ReadOnlyDescriptorAttributes descriptorAttributes={descriptor.attributes} />
    </SectionContainer>
  )
}

export const ConsumerEServiceDescriptorAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={1000} />
}

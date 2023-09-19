import { EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { ReadOnlyDescriptorAttributes } from '@/components/shared/ReadOnlyDescriptorAttributes'
import { useParams } from '@/router'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ProviderEServiceDescriptorAttributes: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.sections.attributes' })

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { data: descriptor } = EServiceQueries.useGetDescriptorProvider(eserviceId, descriptorId)

  if (!descriptor?.attributes) return null

  return (
    <SectionContainer newDesign title={t('title')} description={t('description')}>
      <ReadOnlyDescriptorAttributes descriptorAttributes={descriptor.attributes} />
    </SectionContainer>
  )
}

export const ProviderEServiceDescriptorAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={1000} />
}

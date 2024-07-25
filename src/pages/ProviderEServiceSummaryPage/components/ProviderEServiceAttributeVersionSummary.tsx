import React from 'react'
import { ReadOnlyDescriptorAttributes } from '@/components/shared/ReadOnlyDescriptorAttributes'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'

export const ProviderEServiceAttributeVersionSummary: React.FC = () => {
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = EServiceQueries.useGetDescriptorProvider(
    params.eserviceId,
    params.descriptorId,
    { suspense: false }
  )

  if (!descriptor) return null

  return <ReadOnlyDescriptorAttributes descriptorAttributes={descriptor.attributes} />
}

import React from 'react'
import { ReadOnlyDescriptorAttributes } from '@/components/shared/ReadOnlyDescriptorAttributes'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'

export const ProviderEServiceAttributeVersionSummary: React.FC = () => {
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorProvider(params.eserviceId, params.descriptorId)
  )

  if (!descriptor) return null

  return <ReadOnlyDescriptorAttributes descriptorAttributes={descriptor.attributes} />
}

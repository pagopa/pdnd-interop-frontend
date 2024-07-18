import React from 'react'
import { ReadOnlyDescriptorAttributes } from '@/components/shared/ReadOnlyDescriptorAttributes'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { URL_FRAGMENTS } from '@/router/router.utils'
import { useQuery } from '@tanstack/react-query'

export const ProviderEServiceAttributeVersionSummary: React.FC = () => {
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = useQuery({
    ...EServiceQueries.getDescriptorProvider(params.eserviceId, params.descriptorId),
    enabled: params.descriptorId !== URL_FRAGMENTS.FIRST_DRAFT,
  })

  if (!descriptor || params.descriptorId === URL_FRAGMENTS.FIRST_DRAFT) return null

  return <ReadOnlyDescriptorAttributes descriptorAttributes={descriptor.attributes} />
}

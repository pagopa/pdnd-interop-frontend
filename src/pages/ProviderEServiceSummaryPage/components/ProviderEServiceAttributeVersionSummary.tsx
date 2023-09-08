import React from 'react'
import { remapDescriptorAttributes } from '@/utils/attribute.utils'
import { ReadOnlyDescriptorAttributes } from '@/components/shared/ReadOnlyDescriptorAttributes'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'

export const ProviderEServiceAttributeVersionSummary: React.FC = () => {
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = EServiceQueries.useGetDescriptorProvider(
    params.eserviceId,
    params.descriptorId
  )

  const descriptorAttributes = React.useMemo(() => {
    if (!descriptor) return undefined
    return remapDescriptorAttributes(descriptor.attributes)
  }, [descriptor])

  if (!descriptorAttributes) return null

  return <ReadOnlyDescriptorAttributes descriptorAttributes={descriptorAttributes} />
}

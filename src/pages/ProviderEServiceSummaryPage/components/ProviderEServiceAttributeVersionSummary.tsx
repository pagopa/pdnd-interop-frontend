import React from 'react'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { remapDescriptorAttributes } from '@/utils/attribute.utils'
import { ReadOnlyDescriptorAttributes } from '@/components/shared/ReadOnlyDescriptorAttributes'

type ProviderEServiceAttributeVersionSummaryProps = {
  descriptor: ProducerEServiceDescriptor
}

export const ProviderEServiceAttributeVersionSummary: React.FC<
  ProviderEServiceAttributeVersionSummaryProps
> = ({ descriptor }) => {
  const descriptorAttributes = React.useMemo(() => {
    return remapDescriptorAttributes(descriptor.attributes)
  }, [descriptor])

  return <ReadOnlyDescriptorAttributes descriptorAttributes={descriptorAttributes} />
}

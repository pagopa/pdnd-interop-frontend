import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'

export function useGetPreviousVersionDescriptor(
  currentDescriptor: ProducerEServiceDescriptor | undefined
) {
  const previousVersionCompactDescriptor = currentDescriptor?.eservice.descriptors.find(
    (compactDescriptor) =>
      parseInt(compactDescriptor.version) === parseInt(currentDescriptor.version) - 1
  )

  const { data: previousVersionDescriptor } = EServiceQueries.useGetDescriptorProvider(
    currentDescriptor?.eservice.id,
    previousVersionCompactDescriptor?.id,
    {
      suspense: false,
      enabled: true,
    }
  )

  return previousVersionDescriptor
}

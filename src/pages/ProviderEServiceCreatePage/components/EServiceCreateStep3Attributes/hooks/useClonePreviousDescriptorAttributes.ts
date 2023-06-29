import { remapDescriptorAttributes } from '@/utils/attribute.utils'
import React from 'react'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'
import { useToastNotification } from '@/stores'
import type { UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { EServiceCreateStep3FormValues } from '../EServiceCreateStep3Attributes'

export function useClonePreviousDescriptorAttributes(
  currentDescriptor: ProducerEServiceDescriptor | undefined,
  setValue: UseFormSetValue<EServiceCreateStep3FormValues>
) {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step3' })
  const { showToast } = useToastNotification()

  const previousVersionCompactDescriptor = currentDescriptor?.eservice.descriptors.find(
    (compactDescriptor) =>
      Number(compactDescriptor.version) === Number(currentDescriptor.version) - 1
  )

  const { data: previousVersionDescriptor } = EServiceQueries.useGetDescriptorProvider(
    currentDescriptor?.eservice.id,
    previousVersionCompactDescriptor?.id,
    {
      suspense: false,
      enabled: true,
    }
  )

  const handleClonePreviousDescriptorAttributes = React.useCallback(() => {
    if (!previousVersionDescriptor) return
    const remappedPreviousVersionDescriptorAttributes = remapDescriptorAttributes(
      previousVersionDescriptor.attributes
    )

    setValue('attributes.certified', remappedPreviousVersionDescriptorAttributes.certified)
    setValue('attributes.verified', remappedPreviousVersionDescriptorAttributes.verified)
    setValue('attributes.declared', remappedPreviousVersionDescriptorAttributes.declared)

    showToast(t('attributeCloneSuccess'), 'success')
  }, [previousVersionDescriptor, setValue, t, showToast])

  const hasPreviousVersionNoAttributes = React.useMemo(() => {
    if (!previousVersionDescriptor) return false
    const remappedPreviousVersionDescriptorAttributes = remapDescriptorAttributes(
      previousVersionDescriptor.attributes
    )

    return (
      !remappedPreviousVersionDescriptorAttributes.certified.length &&
      !remappedPreviousVersionDescriptorAttributes.verified.length &&
      !remappedPreviousVersionDescriptorAttributes.declared.length
    )
  }, [previousVersionDescriptor])

  return { handleClonePreviousDescriptorAttributes, hasPreviousVersionNoAttributes }
}

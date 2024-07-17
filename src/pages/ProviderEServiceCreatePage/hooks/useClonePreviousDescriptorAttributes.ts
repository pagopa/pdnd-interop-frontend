import React from 'react'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'
import { useToastNotification } from '@/stores'
import type { UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { EServiceCreateStepAttributesFormValues } from '../components/EServiceCreateStepAttributes/EServiceCreateStepAttributes'
import { useQuery } from '@tanstack/react-query'

export function useClonePreviousDescriptorAttributes(
  currentDescriptor: ProducerEServiceDescriptor | undefined,
  setValue: UseFormSetValue<EServiceCreateStepAttributesFormValues>
) {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step3' })
  const { showToast } = useToastNotification()

  const eserviceId = currentDescriptor?.eservice.id
  const previousDescriptorId = currentDescriptor?.eservice.descriptors.find(
    (compactDescriptor) =>
      Number(compactDescriptor.version) === Number(currentDescriptor.version) - 1
  )?.id

  const { data: previousVersionDescriptor } = useQuery({
    ...EServiceQueries.getDescriptorProvider(eserviceId!, previousDescriptorId!),
    enabled: Boolean(eserviceId) && Boolean(previousDescriptorId),
  })

  const handleClonePreviousDescriptorAttributes = React.useCallback(() => {
    if (!previousVersionDescriptor) return

    setValue('attributes.certified', previousVersionDescriptor.attributes.certified)
    setValue('attributes.verified', previousVersionDescriptor.attributes.verified)
    setValue('attributes.declared', previousVersionDescriptor.attributes.declared)

    showToast(t('attributeCloneSuccess'), 'success')
  }, [previousVersionDescriptor, setValue, t, showToast])

  const hasPreviousVersionNoAttributes = React.useMemo(() => {
    if (!previousVersionDescriptor) return false

    return (
      !previousVersionDescriptor.attributes.certified.length &&
      !previousVersionDescriptor.attributes.verified.length &&
      !previousVersionDescriptor.attributes.declared.length
    )
  }, [previousVersionDescriptor])

  return { handleClonePreviousDescriptorAttributes, hasPreviousVersionNoAttributes }
}

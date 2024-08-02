import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { PurposeCreateFormValues } from './PurposeCreateEServiceForm'
import { EServiceQueries } from '@/api/eservice'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { useQuery } from '@tanstack/react-query'

export const PurposeCreateProviderRiskAnalysisAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'create.eserviceRiskAnalysisSection' })
  const { setValue, watch } = useFormContext<PurposeCreateFormValues>()

  const selectedEService = watch('eservice')
  const selectedEServiceId = selectedEService?.id

  React.useEffect(() => {
    setValue('providerRiskAnalysisId', null)
  }, [selectedEServiceId, setValue])

  const { data: selectedEServiceDescriptorId, isLoading } = useQuery({
    ...EServiceQueries.getCatalogList({
      q: selectedEService?.name,
      agreementStates: ['ACTIVE'],
      // e-service might also be on 'DEPRECATED' state
      states: ['PUBLISHED'],
      limit: 50,
      offset: 0,
    }),
    select: (d) =>
      d?.results.find((eservice) => eservice.id === selectedEServiceId)?.activeDescriptor?.id,
  })

  const { data: autocompleteOptions = [], isPending: isLoadingEService } = useQuery({
    ...EServiceQueries.getDescriptorCatalog(selectedEServiceId!, selectedEServiceDescriptorId!),
    enabled: Boolean(selectedEServiceId && selectedEServiceDescriptorId),
    select: (descriptor) =>
      descriptor.eservice.riskAnalysis.map((riskAnalysis) => ({
        label: riskAnalysis.name,
        value: riskAnalysis.id,
      })),
  })

  return (
    <RHFAutocompleteSingle
      key={selectedEServiceId}
      sx={{ my: 0 }}
      loading={isLoading || isLoadingEService}
      name="providerRiskAnalysisId"
      label={t('purposeField.label')}
      options={autocompleteOptions}
    />
  )
}

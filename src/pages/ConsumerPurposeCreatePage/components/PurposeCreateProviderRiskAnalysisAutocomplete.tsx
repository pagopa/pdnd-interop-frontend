import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { PurposeCreateFormValues } from './PurposeCreateEServiceForm'
import { EServiceQueries } from '@/api/eservice'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'

export const PurposeCreateProviderRiskAnalysisAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'create.eserviceRiskAnalysisSection' })
  const { setValue, watch } = useFormContext<PurposeCreateFormValues>()

  const selectedEService = watch('eservice')
  const selectedEServiceId = selectedEService?.id

  React.useEffect(() => {
    setValue('providerRiskAnalysisId', null)
  }, [selectedEServiceId, setValue])

  const { data: eservices, isInitialLoading } = EServiceQueries.useGetCatalogList(
    {
      q: selectedEService?.name,
      agreementStates: ['ACTIVE'],
      // e-service might also be on 'DEPRECATED' state
      states: ['PUBLISHED'],
      limit: 50,
      offset: 0,
    },
    {
      suspense: false,
    }
  )

  const selectedEServiceDescriptorId = eservices?.results.find(
    (eservice) => eservice.id === selectedEServiceId
  )?.activeDescriptor?.id

  const { data: descriptor, isLoading: isLoadingEService } =
    EServiceQueries.useGetDescriptorCatalog(selectedEServiceId!, selectedEServiceDescriptorId!, {
      suspense: false,
      enabled: !!selectedEServiceId && !!selectedEServiceDescriptorId,
    })

  const riskAnalysisList = descriptor?.eservice.riskAnalysis ?? []
  const autocompleteOptions = riskAnalysisList.map((riskAnalysis) => ({
    label: riskAnalysis.name,
    value: riskAnalysis.id,
  }))

  return (
    <RHFAutocompleteSingle
      key={selectedEServiceId}
      sx={{ my: 0 }}
      loading={isInitialLoading || isLoadingEService}
      name="providerRiskAnalysisId"
      label={t('purposeField.label')}
      options={autocompleteOptions}
    />
  )
}

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { PurposeCreateFormValues } from './PurposeCreateEServiceForm'
import { EServiceQueries } from '@/api/eservice'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'

/**
 * TODO remove this mocks when BE is ready
 */
type RiskAnalysis = {
  id: string
  name: string
  riskAnalysisForm: {
    version: string
    answers: [string]
  }
  createdAt: string
}
const riskAnalysisListMock: Array<RiskAnalysis> = [
  {
    id: 'mock 1',
    name: 'mock 1',
    riskAnalysisForm: {
      version: '1',
      answers: ['1'],
    },
    createdAt: 'mock 1',
  },
  {
    id: 'mock 2',
    name: 'mock 2',
    riskAnalysisForm: {
      version: '2',
      answers: ['2'],
    },
    createdAt: 'mock 2',
  },
]

// TODO vedi PurposeCreateEServiceAutocomplete per come è fatto

export const PurposeCreateProviderPurposeAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { setValue, watch } = useFormContext<PurposeCreateFormValues>()

  const selectedEServiceId = watch('eserviceId')

  React.useEffect(() => {
    setValue('providerPurposeId', null)
  }, [selectedEServiceId, setValue])

  const { data: eservices, isInitialLoading } = EServiceQueries.useGetCatalogList(
    {
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

  const riskAnalysisList = /* descriptor?.riskAnalysis */ riskAnalysisListMock ?? []
  const autocompleteOptions = riskAnalysisList.map((riskAnalysis) => ({
    label: riskAnalysis.name,
    value: riskAnalysis.id,
  }))

  return (
    <RHFAutocompleteSingle
      key={selectedEServiceId}
      sx={{ my: 0 }}
      loading={isLoadingEService}
      name="providerPurposeId"
      label={'TODO Finalità da utilizzare'}
      options={autocompleteOptions}
    />
  )
}

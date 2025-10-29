import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import type { CatalogEService, CompactEService } from '@/api/api.generatedTypes'
import type { PurposeCreateFormValues } from './PurposeCreateForm'
import { useQuery } from '@tanstack/react-query'
import { DelegationQueries } from '@/api/delegation'
import { AuthHooks } from '@/api/auth'
import { Stack } from '@mui/system'
import { Alert } from '@mui/material'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'

export const PurposeCreateEServiceAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose')
  const selectedEServiceRef = React.useRef<CatalogEService | CompactEService | undefined>(undefined)

  const { jwt } = AuthHooks.useJwt()

  const { watch } = useFormContext<PurposeCreateFormValues>()
  const [eserviceAutocompleteTextInput, setEserviceAutocompleteTextInput] =
    useAutocompleteTextInput()

  const formatAutocompleteOptionLabel = React.useCallback(
    (eservice: CatalogEService | CompactEService) => {
      return `${eservice.name} ${t('edit.eserviceProvider')} ${eservice.producer.name}`
    },
    [t]
  )

  const selectedConsumerId = watch('consumerId')

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected eservice name.
   */
  function getQ() {
    let result = eserviceAutocompleteTextInput

    if (
      selectedEServiceRef.current &&
      eserviceAutocompleteTextInput === formatAutocompleteOptionLabel(selectedEServiceRef.current)
    ) {
      result = ''
    }

    return result
  }

  const { data: eservices = [], isLoading: isEServiceLoading } = useQuery({
    ...EServiceQueries.getCatalogList({
      q: getQ(),
      agreementStates: ['ACTIVE'],
      // e-service might also be on 'DEPRECATED' state
      states: ['PUBLISHED'],
      limit: 200,
      offset: 0,
    }),
    enabled: selectedConsumerId === jwt?.organizationId || !selectedConsumerId,
    select: (e) => e.results ?? [],
  })

  const { data: delegatedEServices = [], isLoading: isDelegatedEServiceLoading } = useQuery({
    ...DelegationQueries.getConsumerDelegatedEservices({
      q: getQ(),
      delegatorId: selectedConsumerId,
      limit: 50,
      offset: 0,
    }),
    enabled: Boolean(selectedConsumerId) && selectedConsumerId !== jwt?.organizationId,
    select: (e) => e.results ?? [],
  })

  const eservicesList =
    selectedConsumerId === jwt?.organizationId || !selectedConsumerId
      ? eservices
      : delegatedEServices

  const autocompleteOptions = (eservicesList ?? []).map((eservice) => ({
    label: formatAutocompleteOptionLabel(eservice),
    value: eservice,
  }))

  const { data: linkedPurposeTemplates } = useQuery({
    //TODO: TO CHECK WHEN THE BACKEND PART WILL BE READY IF IT'S OK AND THE ALERT SHOWS UP CORRECTLY
    ...PurposeTemplateQueries.getCatalogPurposeTemplates({
      eserviceIds: selectedEServiceRef.current?.id ? [selectedEServiceRef.current.id] : [],
      offset: 0,
      limit: 50,
    }),
    enabled: Boolean(selectedEServiceRef.current?.id),
  })

  return (
    <Stack spacing={2} sx={{ mb: 2 }}>
      <RHFAutocompleteSingle
        sx={{ my: 0 }}
        loading={isEServiceLoading || isDelegatedEServiceLoading}
        name="eservice"
        label={t('create.eserviceField.label')}
        infoLabel={t('create.eserviceField.infoLabel')}
        options={autocompleteOptions}
        onValueChange={(value) => {
          selectedEServiceRef.current = eservicesList.find(
            (eservice) => eservice.id === value?.value.id
          )
        }}
        onInputChange={(_, value) => setEserviceAutocompleteTextInput(value)}
        rules={{ required: true }}
      />
      {linkedPurposeTemplates &&
        linkedPurposeTemplates?.results.length > 0 &&
        eserviceAutocompleteTextInput !== '' && (
          <Alert severity="success"> {t('create.eserviceField.alert.label')}</Alert>
        )}
    </Stack>
  )
}

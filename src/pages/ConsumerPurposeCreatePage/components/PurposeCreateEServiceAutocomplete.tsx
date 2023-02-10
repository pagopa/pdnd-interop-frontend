import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { Select } from '@/components/shared/ReactHookFormInputs'
import { useJwt } from '@/hooks/useJwt'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@mui/material'

export const PurposeCreateEServiceAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { jwt } = useJwt()

  // This must be replaced by the EServiceQueries.useGetCatalogList
  // waiting for agreementStates implementation.
  const { data: eservices = [] } = EServiceQueries.useGetListFlat({
    callerId: jwt?.organizationId,
    consumerId: jwt?.organizationId,
    agreementStates: ['ACTIVE'],
    // e-service might also be on 'DEPRECATED' state
    state: 'PUBLISHED',
  })

  const autocompleteOptions = React.useMemo(() => {
    return (eservices ?? []).map((eservice) => ({
      label: `${eservice.name} erogato da ${eservice.producerName}`,
      value: eservice.id,
    }))
  }, [eservices])

  return (
    <Select
      sx={{ my: 0 }}
      focusOnMount
      name="eserviceId"
      label={t('create.eserviceField.label')}
      emptyLabel="Nessun e-service associabile"
      options={autocompleteOptions}
    />
  )
}

export const PurposeCreateEServiceAutocompleteSkeleton: React.FC = () => {
  return <Skeleton variant="rectangular" height={59} />
}

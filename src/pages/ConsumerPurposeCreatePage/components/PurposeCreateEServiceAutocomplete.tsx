import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { Select } from '@/components/shared/ReactHookFormInputs'
import { useJwt } from '@/hooks/useJwt'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { PurposeCreateFormValues } from '../ConsumerPurposeCreate.page'
import { Skeleton } from '@mui/material'

export const PurposeCreateEServiceAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { jwt } = useJwt()

  const { data: eservices = [] } = EServiceQueries.useGetListFlat({
    callerId: jwt?.organizationId,
    consumerId: jwt?.organizationId,
    agreementStates: ['ACTIVE'],
    state: 'PUBLISHED',
  })

  const { watch, setValue } = useFormContext<PurposeCreateFormValues>()
  const eserviceId = watch('eserviceId')

  const autocompleteOptions = React.useMemo(() => {
    return (eservices ?? []).map((eservice) => ({
      label: `${eservice.name} erogato da ${eservice.producerName}`,
      value: eservice.id,
    }))
  }, [eservices])

  React.useEffect(() => {
    if (!eserviceId && autocompleteOptions.length > 0) {
      setValue('eserviceId', autocompleteOptions[0].value)
    }
  }, [eserviceId, autocompleteOptions, setValue])

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

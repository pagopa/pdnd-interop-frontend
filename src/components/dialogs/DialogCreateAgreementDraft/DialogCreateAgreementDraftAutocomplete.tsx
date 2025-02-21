import type { DelegationTenant } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { DelegationQueries } from '@/api/delegation'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type DialogCreateAgreementAutocompleteProps = {
  eserviceId: string
  preselectedConsumer: DelegationTenant | undefined
}

export const DialogCreateAgreementAutocomplete: React.FC<
  DialogCreateAgreementAutocompleteProps
> = ({ eserviceId, preselectedConsumer }) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogCreateAgreementDraft',
  })
  const { jwt } = AuthHooks.useJwt()

  const { data: delegations = [] } = useQuery({
    ...DelegationQueries.getList({
      limit: 50,
      offset: 0,
      eserviceIds: [eserviceId],
      kind: 'DELEGATED_CONSUMER',
      states: ['ACTIVE'],
      delegatorIds: [jwt?.organizationId as string],
    }),
    enabled: Boolean(jwt?.organizationId),
    select: ({ results }) => results ?? [],
  })
  const isDelegator = delegations.length > 0

  const selectedConsumerRef = React.useRef<DelegationTenant | undefined>(preselectedConsumer)
  const hasSetFirstConsumer = React.useRef(Boolean(preselectedConsumer))

  const { setValue, watch } = useFormContext()
  const [consumerAutocompleteTextInput, setConsumerAutocompleteTextInput] =
    useAutocompleteTextInput(preselectedConsumer?.name ?? '')

  const selectedConsumerId = watch('consumerId')

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected attribute name.
   */
  function getQ() {
    let result = consumerAutocompleteTextInput

    if (
      selectedConsumerRef.current &&
      consumerAutocompleteTextInput === selectedConsumerRef.current.name
    ) {
      result = ''
    }

    return result
  }

  const { data: delegators = [], isLoading } = useQuery({
    ...DelegationQueries.getConsumerDelegators({
      q: getQ(),
      limit: 50,
      offset: 0,
      eserviceIds: [eserviceId],
    }),
    select: ({ results }) => results ?? [],
  })

  React.useEffect(() => {
    if (
      !selectedConsumerId &&
      !hasSetFirstConsumer.current &&
      delegators &&
      delegators?.length > 0
    ) {
      setValue('consumerId', delegators[0])
      setConsumerAutocompleteTextInput(delegators[0].name)
      selectedConsumerRef.current = delegators[0]
      hasSetFirstConsumer.current = true
    }
  }, [setValue, selectedConsumerId, delegators, setConsumerAutocompleteTextInput])

  const tenantOptions =
    jwt && !isDelegator
      ? [{ id: jwt.organizationId, name: jwt.organization.name }, ...delegators]
      : delegators

  const autocompleteOptions = tenantOptions.map((tenant) => ({
    label: tenant.name,
    value: tenant.id,
  }))

  return (
    <RHFAutocompleteSingle
      sx={{ my: 0 }}
      loading={isLoading}
      name="consumerId"
      options={autocompleteOptions}
      label={t('consumerField.label')}
      onValueChange={(value) => {
        selectedConsumerRef.current = tenantOptions?.find((tenant) => tenant.id === value?.value)
      }}
      onInputChange={(_, value) => setConsumerAutocompleteTextInput(value)}
      rules={{ required: true }}
    />
  )
}

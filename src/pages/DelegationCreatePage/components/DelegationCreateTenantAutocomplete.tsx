import type { CompactTenant, DelegationKind } from '@/api/api.generatedTypes'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { TenantQueries } from '@/api/tenant'
import { useQuery } from '@tanstack/react-query'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { AuthHooks } from '@/api/auth'

type DelegationCreateTenantAutocompleteProps = {
  delegationKind: DelegationKind
}

export const DelegationCreateTenantAutocomplete: React.FC<
  DelegationCreateTenantAutocompleteProps
> = ({ delegationKind }) => {
  const { t } = useTranslation('party')
  const { jwt } = AuthHooks.useJwt()

  const selectedTenantRef = React.useRef<CompactTenant | undefined>(undefined)

  const currentUserOrganizationId = jwt?.organizationId

  const [tenantAutocompleteTextInput, setTenantAutocompleteTextInput] = useAutocompleteTextInput()

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected eservice name.
   */
  function getQ() {
    let result = tenantAutocompleteTextInput

    if (
      selectedTenantRef.current &&
      tenantAutocompleteTextInput === selectedTenantRef.current.name
    ) {
      result = ''
    }

    return result
  }

  const { data: delegates = [], isLoading: isLoadingDelegates } = useQuery({
    ...TenantQueries.getTenants({
      name: getQ(),
      limit: 50,
      features: [delegationKind],
    }),
    select: (d) => (d.results ?? []).filter((d) => d.id !== currentUserOrganizationId),
  })

  const autocompleteOptions = delegates.map((delegate) => ({
    label: delegate.name,
    value: delegate.id,
  }))

  return (
    <RHFAutocompleteSingle
      sx={{ my: 0 }}
      loading={isLoadingDelegates}
      name="delegateId"
      label={
        delegationKind === 'DELEGATED_CONSUMER'
          ? t(`delegations.create.delegateField.consumer.label`)
          : t(`delegations.create.delegateField.provider.label`)
      }
      infoLabel={
        delegationKind === 'DELEGATED_CONSUMER'
          ? t('delegations.create.delegateField.consumer.infoLabel')
          : t('delegations.create.delegateField.provider.infoLabel')
      }
      options={autocompleteOptions}
      onValueChange={(value) => {
        selectedTenantRef.current = delegates.find((delegate) => delegate.id === value?.value)
      }}
      onInputChange={(_, value) => setTenantAutocompleteTextInput(value)}
      rules={{ required: true }}
    />
  )
}

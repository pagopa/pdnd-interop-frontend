import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { PurposeCreateFormValues } from './PurposeCreateForm'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { useQuery } from '@tanstack/react-query'
import { DelegationQueries } from '@/api/delegation'
import { AuthHooks } from '@/api/auth'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'

type PurposeCreateConsumerAutocompleteProps = {
  preselectedConsumer?: { id: string; name: string }
}

export const PurposeCreateConsumerAutocomplete: React.FC<
  PurposeCreateConsumerAutocompleteProps
> = ({ preselectedConsumer }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'create' })
  const selectedConsumerRef = React.useRef<{ id: string; name: string } | undefined>(
    preselectedConsumer
  )
  const hasSetFirstConsumer = React.useRef(Boolean(preselectedConsumer))
  const { jwt } = AuthHooks.useJwt()

  const { setValue, watch } = useFormContext<PurposeCreateFormValues>()
  const [consumerAutocompleteTextInput, setConsumerAutocompleteTextInput] =
    useAutocompleteTextInput(preselectedConsumer?.name)

  const selectedConsumerId = watch('consumerId')

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected eservice name.
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
    ...DelegationQueries.getConsumerDelegatorsWithAgreements({
      q: getQ(),
      offset: 0,
      limit: 50,
    }),
    select: (d) => d.results ?? [],
  })

  React.useEffect(() => {
    if (!selectedConsumerId && !hasSetFirstConsumer.current && delegators.length > 0) {
      setValue('consumerId', delegators[0].id)
      setConsumerAutocompleteTextInput(delegators[0].name)
      selectedConsumerRef.current = delegators[0]
      hasSetFirstConsumer.current = true
    }
  }, [delegators, selectedConsumerId, setConsumerAutocompleteTextInput, setValue])

  const tenantOptions = jwt
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
      infoLabel={t('consumerField.infoLabel')}
      onValueChange={(value) => {
        selectedConsumerRef.current = tenantOptions?.find((tenant) => tenant.id === value?.value)
      }}
      onInputChange={(_, value) => setConsumerAutocompleteTextInput(value)}
      rules={{ required: true }}
    />
  )
}

import { GetListAgreementQueryFilters } from '@/api/agreement/agreement.api.types'
import { EServiceQueries } from '@/api/eservice'
import { AutocompleteMultiple } from '@/components/shared/ReactHookFormInputs'
import { useAutocompleteFilterInput } from '@/hooks/useAutocompleteFilterInput'
import { useJwt } from '@/hooks/useJwt'
import { InputOption } from '@/types/common.types'
import { Button, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type ConsumerAgreementsTableFiltersProps = {
  clearFilters: VoidFunction
  enableFilters: VoidFunction
  filtersUseFormMethods: UseFormReturn<GetListAgreementQueryFilters, unknown>
}

export const ConsumerAgreementsTableFilters: React.FC<ConsumerAgreementsTableFiltersProps> = ({
  clearFilters,
  enableFilters,
  filtersUseFormMethods,
}) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  return (
    <FormProvider {...filtersUseFormMethods}>
      <Stack
        onSubmit={enableFilters}
        component="form"
        direction="row"
        spacing={2}
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Stack direction="row" spacing={2} sx={{ width: '60%' }}>
          <EServiceFilterAutocomplete />
          <StateFilterAutocomplete />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button size="small" variant="outlined" type="submit">
            {tCommon('filter')}
          </Button>
          <Button size="small" variant="text" type="button" onClick={clearFilters}>
            {tCommon('cancelFilter')}
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

const EServiceFilterAutocomplete: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'list.filters' })
  const [eserviceAutocompleteText, handleAutocompleteInputChange] = useAutocompleteFilterInput()

  const { jwt } = useJwt()

  const { data: eservices, isFetching: isFetchingEServices } = EServiceQueries.useGetCatalogList(
    {
      q: eserviceAutocompleteText,
      producersIds: [jwt?.organizationId] as Array<string>,
      limit: 50,
      offset: 0,
    },
    { suspense: false, keepPreviousData: true, enabled: !!jwt?.organizationId }
  )

  const eservicesOptions =
    eservices?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  return (
    <AutocompleteMultiple
      placeholder=""
      size="small"
      name="eservicesIds"
      onInputChange={handleAutocompleteInputChange}
      label={t('eserviceField.label')}
      options={eservicesOptions}
      loading={isFetchingEServices}
    />
  )
}

const StateFilterAutocomplete: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'list.filters' })

  const stateOptions: Array<InputOption> = [
    { label: t('statusField.optionLabels.ACTIVE'), value: 'ACTIVE' },
    { label: t('statusField.optionLabels.DRAFT'), value: 'DRAFT' },
    { label: t('statusField.optionLabels.SUSPENDED'), value: 'SUSPENDED' },
    { label: t('statusField.optionLabels.PENDING'), value: 'PENDING' },
    { label: t('statusField.optionLabels.ARCHIVED'), value: 'ARCHIVED' },
    { label: t('statusField.optionLabels.REJECTED'), value: 'REJECTED' },
    {
      label: t('statusField.optionLabels.MISSING_CERTIFIED_ATTRIBUTES'),
      value: 'MISSING_CERTIFIED_ATTRIBUTES',
    },
  ]

  return (
    <AutocompleteMultiple
      placeholder=""
      size="small"
      name="states"
      label={t('statusField.label')}
      options={stateOptions}
    />
  )
}

import { EServiceQueries } from '@/api/eservice'
import { PurposeGetListQueryFilters } from '@/api/purpose/purpose.api.types'
import { AutocompleteMultiple, TextField } from '@/components/shared/ReactHookFormInputs'
import { useAutocompleteFilterInput } from '@/hooks/useAutocompleteFilterInput'
import { InputOption } from '@/types/common.types'
import { Box, Button, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type ConsumerPurposesTableFiltersProps = {
  clearFilters: VoidFunction
  enableFilters: VoidFunction
  filtersUseFormMethods: UseFormReturn<PurposeGetListQueryFilters, unknown>
}

export const ConsumerPurposesTableFilters: React.FC<ConsumerPurposesTableFiltersProps> = ({
  clearFilters,
  enableFilters,
  filtersUseFormMethods,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'list.filters' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  return (
    <FormProvider {...filtersUseFormMethods}>
      <Stack
        onSubmit={enableFilters}
        component="form"
        noValidate
        direction="row"
        spacing={8}
        justifyContent="space-between"
        alignItems="end"
        sx={{ mb: 4 }}
      >
        <Stack spacing={2} sx={{ flex: 1 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              sx={{ m: 0, flex: 0.5 }}
              size="small"
              name="q"
              label={t('nameField.label')}
            />
            <Box sx={{ flex: 0.5 }}>
              <EServiceFilterAutocomplete />
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 0.5 }}>
              <ProviderFilterAutocomplete />
            </Box>
            <Box sx={{ flex: 0.5 }}>
              <StateFilterAutocomplete />
            </Box>
          </Stack>
        </Stack>

        <Stack sx={{ flexShrink: 0 }} direction="row" spacing={2}>
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
  const { t } = useTranslation('purpose', { keyPrefix: 'list.filters' })
  const [eserviceAutocompleteText, handleAutocompleteInputChange] = useAutocompleteFilterInput()

  const { data: eservices } = EServiceQueries.useGetProviderList(
    { q: eserviceAutocompleteText, limit: 50, offset: 0 },
    { suspense: false, keepPreviousData: true }
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
    />
  )
}

const ProviderFilterAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'list.filters' })
  const [consumersAutocompleteText, handleAutocompleteInputChange] = useAutocompleteFilterInput()

  const { data: consumers } = EServiceQueries.useGetProducers(
    { offset: 0, limit: 50, q: consumersAutocompleteText },
    { suspense: false, keepPreviousData: true }
  )

  const providersOptions =
    consumers?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  return (
    <AutocompleteMultiple
      placeholder=""
      size="small"
      name="producersIds"
      onInputChange={handleAutocompleteInputChange}
      label={t('providerField.label')}
      options={providersOptions}
    />
  )
}

const StateFilterAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'list.filters' })

  const stateOptions: Array<InputOption> = [
    { label: t('statusField.optionLabels.ACTIVE'), value: 'ACTIVE' },
    { label: t('statusField.optionLabels.WAITING_FOR_APPROVAL'), value: 'WAITING_FOR_APPROVAL' },
    { label: t('statusField.optionLabels.SUSPENDED'), value: 'SUSPENDED' },
    // { label: t('statusField.optionLabels.ARCHIVED'), value: 'ARCHIVED' },
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

import React from 'react'
import { Button, Stack } from '@mui/material'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { AutocompleteMultiple, TextField } from '@/components/shared/ReactHookFormInputs'
import { EServiceQueries } from '@/api/eservice'
import { EServiceGetProviderListQueryFilters } from '@/api/eservice/eservice.api.types'
import { useTranslation } from 'react-i18next'
import { useAutocompleteFilterInput } from '@/hooks/useAutocompleteFilterInput'

interface EServiceTableFiltersProps {
  clearFilters: VoidFunction
  enableFilters: VoidFunction
  filtersFormMethods: UseFormReturn<EServiceGetProviderListQueryFilters, unknown>
}

const EServiceTableFilters: React.FC<EServiceTableFiltersProps> = ({
  clearFilters,
  enableFilters,
  filtersFormMethods,
}) => {
  const { t } = useTranslation('eservice')
  const [consumersAutocompleteText, handleAutocompleteInputChange] = useAutocompleteFilterInput()

  const { data: consumers, isLoading: isLoadingConsumers } = EServiceQueries.useGetConsumers(
    { offset: 0, limit: 50, name: consumersAutocompleteText },
    { suspense: false }
  )

  const consumersOptions =
    consumers?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  return (
    <FormProvider {...filtersFormMethods}>
      <Stack
        onSubmit={enableFilters}
        component="form"
        direction="row"
        spacing={2}
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Stack direction="row" spacing={2} sx={{ width: '60%' }}>
          <TextField
            sx={{ m: 0, width: '55%' }}
            size="small"
            name="q"
            label={t('list.filters.nameField.label')}
          />
          <AutocompleteMultiple
            sx={{ width: '45%' }}
            placeholder=""
            size="small"
            name="consumersIds"
            onInputChange={handleAutocompleteInputChange}
            label={t('list.filters.consumerField.label')}
            options={consumersOptions}
            loading={isLoadingConsumers}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button size="small" variant="outlined" type="submit">
            {t('list.filters.filterBtn')}
          </Button>
          <Button size="small" variant="text" type="button" onClick={clearFilters}>
            {t('list.filters.cancelFilterBtn')}
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

export default EServiceTableFilters

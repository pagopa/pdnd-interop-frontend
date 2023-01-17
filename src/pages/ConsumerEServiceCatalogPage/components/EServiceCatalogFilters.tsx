import React from 'react'
import { Button, Stack } from '@mui/material'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { AutocompleteMultiple, TextField } from '@/components/shared/ReactHookFormInputs'
import { EServiceQueries } from '@/api/eservice'

interface EServiceCatalogFiltersProps {
  clearFilters: VoidFunction
  enableFilters: VoidFunction
  filtersFormMethods: UseFormReturn<any, any>
}

const EServiceCatalogFilters: React.FC<EServiceCatalogFiltersProps> = ({
  clearFilters,
  enableFilters,
  filtersFormMethods,
}) => {
  const { data: producers, isLoading: isLoadingProducers } = EServiceQueries.useGetProducers(
    { limit: 50, offset: 0 },
    {
      suspense: false,
    }
  )

  const producersOptions =
    producers?.results.map((o) => ({
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
            label="Cerca per nome dell’e-service"
          />
          <AutocompleteMultiple
            sx={{ width: '45%' }}
            size="small"
            name="producersIds"
            label="producers"
            options={producersOptions}
            loading={isLoadingProducers}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button size="small" variant="outlined" type="submit">
            Filtra
          </Button>
          <Button size="small" variant="text" type="button" onClick={clearFilters}>
            Annulla filtri
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

export default EServiceCatalogFilters

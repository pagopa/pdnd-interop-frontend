import React from 'react'
import { Button, Stack } from '@mui/material'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { AutocompleteMultiple, TextField } from '@/components/shared/ReactHookFormInputs'

interface EServiceTableFiltersProps {
  clearFilters: VoidFunction
  enableFilters: VoidFunction
  filtersFormMethods: UseFormReturn<any, any>
  filterOptions: Array<{
    label: string
    value: unknown
  }>
}

const EServiceTableFilters: React.FC<EServiceTableFiltersProps> = ({
  clearFilters,
  enableFilters,
  filtersFormMethods,
  filterOptions,
}) => {
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
        <Stack direction="row" spacing={2} sx={{ flex: 0.8 }}>
          <TextField
            sx={{ m: 0, flex: 0.55 }}
            size="small"
            name="q"
            label="Cerca per nome dell’e-service"
          />
          <AutocompleteMultiple
            sx={{ flex: 0.45 }}
            size="small"
            name="consumerIds"
            label="consumers"
            options={filterOptions}
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

export default EServiceTableFilters

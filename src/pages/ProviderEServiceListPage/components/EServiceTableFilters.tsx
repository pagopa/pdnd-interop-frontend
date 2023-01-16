import React from 'react'
import { Box, Button, Stack } from '@mui/material'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { AutocompleteMultiple, TextField } from '@/components/shared/ReactHookFormInputs'

interface EServiceTableFiltersProps {
  clearFilters: VoidFunction
  enableFilters: VoidFunction
  filtersFormMethods: UseFormReturn<any, any>
}

const EServiceTableFilters: React.FC<EServiceTableFiltersProps> = ({
  clearFilters,
  enableFilters,
  filtersFormMethods,
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
        <TextField sx={{ m: 0 }} size="small" name="q" label="Cerca per nome dell’e-service" />
        {/* <AutocompleteMultiple
          size="small"
          name="consumerIds"
          label="consumers"
          options={[
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
          ]}
        /> */}

        <Stack direction="row" spacing={2}>
          <Button size="small" variant="outlined" type="submit">
            Filtra
          </Button>
          <Button
            size="small"
            variant="outlined"
            sx={{ border: 0, '&:hover': { border: 0 } }}
            type="button"
            onClick={clearFilters}
          >
            Annulla filtri
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

export default EServiceTableFilters

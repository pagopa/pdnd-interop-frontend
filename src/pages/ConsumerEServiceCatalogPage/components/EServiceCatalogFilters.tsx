import React from 'react'
import { Button, Stack } from '@mui/material'
import { FormProvider } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { RHFAutocompleteMultiple, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { EServiceQueries } from '@/api/eservice'
import { useTranslation } from 'react-i18next'
import type { EServiceGetCatalogListQueryFilters } from '@/api/eservice/eservice.api.types'
import { useAutocompleteFilterInput } from '@/hooks/useAutocompleteFilterInput'

interface EServiceCatalogFiltersProps {
  clearFilters: VoidFunction
  enableFilters: VoidFunction
  filtersUseFormMethods: UseFormReturn<EServiceGetCatalogListQueryFilters, unknown>
}

const EServiceCatalogFilters: React.FC<EServiceCatalogFiltersProps> = ({
  clearFilters,
  enableFilters,
  filtersUseFormMethods,
}) => {
  const { t } = useTranslation('eservice')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const [producersAutocompleteText, handleAutocompleteInputChange] = useAutocompleteFilterInput()

  const { data: producers } = EServiceQueries.useGetProducers(
    { offset: 0, limit: 50, q: producersAutocompleteText },
    { suspense: false, keepPreviousData: true }
  )

  const producersOptions =
    producers?.results.map((o) => ({
      label: o.name,
      value: o.id,
    })) || []

  return (
    <FormProvider {...filtersUseFormMethods}>
      <Stack
        onSubmit={enableFilters}
        component="form"
        noValidate
        direction="row"
        spacing={2}
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Stack direction="row" spacing={2} sx={{ width: '60%' }}>
          <RHFTextField
            sx={{ m: 0, width: '55%' }}
            size="small"
            name="q"
            label={t('list.filters.nameField.label')}
          />
          <RHFAutocompleteMultiple
            sx={{ width: '45%' }}
            placeholder=""
            size="small"
            name="producersIds"
            onInputChange={handleAutocompleteInputChange}
            label={t('list.filters.providerField.label')}
            options={producersOptions}
          />
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

export default EServiceCatalogFilters

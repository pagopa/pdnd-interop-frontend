import type { FilterFields, FilterFieldsValues, FiltersHandler } from '@/types/filters.types'
import { Button, Stack } from '@mui/material'
import { FilterField } from './FilterField'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { getFiltersDefaultValues } from '@/utils/filters.utils'
import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'

type MainFiltersProps = {
  fields: FilterFields
  filters: FilterFieldsValues
  onChangeActiveFilters: FiltersHandler
}

export const MainFilters: React.FC<MainFiltersProps> = ({
  fields,
  filters,
  onChangeActiveFilters,
}) => {
  const { t } = useTranslation('filters', { keyPrefix: 'main' })
  const defaultValues = getFiltersDefaultValues(fields, filters)

  const formMethods = useForm<FilterFieldsValues>({
    defaultValues,
  })

  const onSubmit: SubmitHandler<FilterFieldsValues> = useCallback(
    (data) => {
      onChangeActiveFilters(data)
    },
    [onChangeActiveFilters]
  )

  return (
    <FormProvider {...formMethods}>
      <Stack
        component={'form'}
        direction="row"
        spacing={2}
        alignItems="center"
        onSubmit={formMethods.handleSubmit(onSubmit)}
      >
        {fields.map((field) => {
          return <FilterField key={field.name} field={field} />
        })}
        <Button type="submit" variant="contained" color="primary">
          {t('button')}
        </Button>
      </Stack>
    </FormProvider>
  )
}

import type { FilterFields, FilterFieldsValues, FiltersHandler } from '@/types/filters.types'
import { Grid } from '@mui/material'
import { MIButton as Button } from '@pagopa/mui-italia'
import { FilterField } from './FilterField'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import {
  getActiveFiltersCount,
  getFiltersDefaultValues,
  getFiltersValues,
} from '@/utils/filters.utils'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect } from 'react'
import isEqual from 'lodash/isEqual'

type FiltersProps = {
  filters: FilterFieldsValues
  fields: FilterFields
  onChangeActiveFilters: FiltersHandler
  submitButtonVariant?: 'text' | 'contained' | 'outlined'
}

export const Filters: React.FC<FiltersProps> = ({
  fields,
  filters,
  onChangeActiveFilters,
  submitButtonVariant = 'contained',
}) => {
  const { t } = useTranslation('filters')
  const values = getFiltersValues(fields, filters)

  const formMethods = useForm<FilterFieldsValues>({
    values,
  })

  const { reset, getValues } = formMethods

  const onSubmit: SubmitHandler<FilterFieldsValues> = useCallback(
    (data) => {
      onChangeActiveFilters(data)
    },
    [onChangeActiveFilters]
  )

  useEffect(() => {
    // Reset form values when filters change and there are no active filters / Remove all active filters
    const activeFiltersCount = getActiveFiltersCount(filters)
    const defaultValues = getFiltersDefaultValues(fields)
    const currentValues = getValues()
    if (!activeFiltersCount && !isEqual(defaultValues, currentValues)) reset(defaultValues)
  }, [reset, filters, getValues, fields])

  return (
    <FormProvider {...formMethods}>
      <Grid
        component={'form'}
        container
        spacing={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
        onSubmit={formMethods.handleSubmit(onSubmit)}
      >
        {fields.map((field) => {
          return (
            <Grid item xs={12} md={4} key={field.name}>
              <FilterField field={field} />
            </Grid>
          )
        })}
        <Grid item xs={12} md={4}>
          <Button
            type="submit"
            variant={submitButtonVariant}
            color="primary"
            sx={{ width: { xs: '100%', md: 'auto' } }}
          >
            {t('button')}
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

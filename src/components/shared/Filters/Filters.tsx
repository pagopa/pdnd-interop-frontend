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
import { useCallback, useEffect, useRef } from 'react'
import isEqual from 'lodash/isEqual'

type FiltersProps = {
  filters: FilterFieldsValues
  fields: FilterFields
  onChangeActiveFilters: FiltersHandler
}

export const Filters: React.FC<FiltersProps> = ({ fields, filters, onChangeActiveFilters }) => {
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

  const activeFiltersCount = getActiveFiltersCount(filters)
  const prevActiveFiltersCount = useRef(activeFiltersCount)
  const fieldsRef = useRef(fields)
  fieldsRef.current = fields

  useEffect(() => {
    // Reset only when active filters are removed from outside (active -> none),
    // not on re-renders while the user is typing with no filters applied
    if (prevActiveFiltersCount.current > 0 && activeFiltersCount === 0) {
      const defaultValues = getFiltersDefaultValues(fieldsRef.current)
      if (!isEqual(defaultValues, getValues())) reset(defaultValues)
    }
    prevActiveFiltersCount.current = activeFiltersCount
  }, [reset, getValues, activeFiltersCount])

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
            variant="contained"
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

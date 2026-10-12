import type { FilterFields, FilterFieldsValues, FiltersHandler } from '@/types/filters.types'
import { Grid } from '@mui/material'
import { MIButton as Button } from '@pagopa/mui-italia'
import { FilterField } from './FilterField'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { getFiltersDefaultValues } from '@/utils/filters.utils'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect } from 'react'

type FiltersProps = {
  filters: FilterFieldsValues
  fields: FilterFields
  onChangeActiveFilters: FiltersHandler
}

export const Filters: React.FC<FiltersProps> = ({ fields, filters, onChangeActiveFilters }) => {
  const { t } = useTranslation('filters')
  const defaultValues = getFiltersDefaultValues(fields, filters)

  const formMethods = useForm<FilterFieldsValues>({
    defaultValues,
  })

  const { reset } = formMethods

  const onSubmit: SubmitHandler<FilterFieldsValues> = useCallback(
    (data) => {
      onChangeActiveFilters(data)
    },
    [onChangeActiveFilters]
  )

  useEffect(() => {}, [defaultValues, reset])

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

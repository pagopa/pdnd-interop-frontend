import React from 'react'
import { Stack } from '@mui/material'
import { ActiveFilterChips } from './ActiveFiltersChips'
import { FiltersFields } from './FiltersFields'
import type { FilterOption, FieldsValues, FiltersHandler, FilterFields } from '@/types/filter.types'
import type { FiltersHandlers } from '@/hooks/useFilters'
import { getFiltersFieldsInitialValues, getFiltersFieldsDefaultValue } from '@/utils/filter.utils'
import { useSearchParams } from 'react-router-dom'

export type FiltersProps = FiltersHandlers & {
  fields: FilterFields
}

export const Filters: React.FC<FiltersProps> = ({
  activeFilters,
  onChangeActiveFilter,
  onRemoveActiveFilter,
  onResetActiveFilters,
  fields,
}) => {
  const [searchParams] = useSearchParams()
  const [fieldsValues, setFieldsValues] = React.useState<FieldsValues>(() =>
    getFiltersFieldsInitialValues(searchParams, fields)
  )

  const handleFieldsValuesChange = React.useCallback(
    (name: string, value: string | Array<FilterOption>) => {
      setFieldsValues((prev) => ({ ...prev, [name]: value }))
    },
    []
  )

  const handleRemoveActiveFilter: FiltersHandler = (type, filterKey, value) => {
    if (type === 'multiple') {
      const newFieldValue = structuredClone(fieldsValues)[filterKey] as Array<FilterOption>
      handleFieldsValuesChange(
        filterKey,
        newFieldValue.filter(({ value: v }) => v !== value)
      )
    }
    onRemoveActiveFilter(type, filterKey, value)
  }

  const handleResetActiveFilters = () => {
    setFieldsValues(getFiltersFieldsDefaultValue(fields))
    onResetActiveFilters()
  }

  return (
    <Stack direction="column" spacing={2} justifyContent="space-between" sx={{ mb: 4 }}>
      <FiltersFields
        fields={fields}
        fieldsValues={fieldsValues}
        onFieldsValuesChange={handleFieldsValuesChange}
        onChangeActiveFilter={onChangeActiveFilter}
      />
      <ActiveFilterChips
        activeFilters={activeFilters}
        onRemoveActiveFilter={handleRemoveActiveFilter}
        onResetActiveFilters={handleResetActiveFilters}
      />
    </Stack>
  )
}

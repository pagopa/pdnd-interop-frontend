import React from 'react'
import { Stack } from '@mui/material'
import { ActiveFilterChips } from './ActiveFiltersChips'
import { FiltersFields } from './FiltersFields'
import type { FilterOption, FieldsValues, FiltersHandler } from '../../../types/filter.types'
import type { FiltersHandlers } from '@/hooks/useFilters'
import { getFiltersFieldInitialValues, getFiltersFieldsDefaultValue } from '@/utils/filter.utils'

export type FilterField = {
  name: string
  label: string
} & (
  | {
      type: 'multiple'
      options: Array<FilterOption>
      setAutocompleteInput?: React.Dispatch<React.SetStateAction<string>>
    }
  | { type: 'single' }
)

export type FiltersProps = FiltersHandlers & {
  fields: Array<FilterField>
}

export const Filters: React.FC<FiltersProps> = ({
  activeFilters,
  onAddActiveFilter,
  onRemoveActiveFilter,
  onResetActiveFilters,
  fields,
}) => {
  const [fieldsValues, setFieldsValues] = React.useState<FieldsValues>(() =>
    getFiltersFieldInitialValues(activeFilters)
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
        onAddActiveFilter={onAddActiveFilter}
      />
      <ActiveFilterChips
        activeFilters={activeFilters}
        onRemoveActiveFilter={handleRemoveActiveFilter}
        onResetActiveFilters={handleResetActiveFilters}
      />
    </Stack>
  )
}

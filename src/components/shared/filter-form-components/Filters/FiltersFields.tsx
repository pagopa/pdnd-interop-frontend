import React from 'react'
import { Stack } from '@mui/material'
import type { FiltersProps } from './Filters'
import { FilterTextField } from '../FilterTextField'
import { FilterAutocompleteMultiple } from '../FilterAutocompleteMultiple'
import type { FieldsState, FilterOption, UpdateFilters } from './filters.types'

type FiltersFieldsProps = Pick<FiltersProps, 'fields'> & {
  updateFilters: UpdateFilters
  fieldsState: FieldsState
  setFieldsState: React.Dispatch<React.SetStateAction<FieldsState>>
}

export const FiltersFields: React.FC<FiltersFieldsProps> = ({
  fields,
  fieldsState,
  setFieldsState,
  updateFilters,
}) => {
  const debounceRef = React.useRef<NodeJS.Timeout>()
  const dataQueueRef = React.useRef<Record<string, FilterOption[]>>({})

  const enableDebouncedMultipleFieldFilters = () => {
    Object.entries(dataQueueRef.current).forEach(([filterKey, value]) => {
      updateFilters('multiple', filterKey, value)
    })
  }

  const enableTextFieldFilters = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    const target = event.target as HTMLInputElement
    const filterKey = target.name
    const value = target.value

    target.blur()

    updateFilters('single', filterKey, value)
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterKey = event.currentTarget.name
    const value = event.currentTarget.value
    setFieldsState((prev) => ({ ...prev, [filterKey]: value }))
  }

  const handleAutocompleteMultipleChange = (
    filterKey: string,
    _: unknown,
    data: FieldsState['string']
  ) => {
    setFieldsState((prev) => ({ ...prev, [filterKey]: data }))
    dataQueueRef.current = { ...dataQueueRef.current, [filterKey]: data as FilterOption[] }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(enableDebouncedMultipleFieldFilters, 300)
  }

  return (
    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
      {fields.map((field) => {
        if (field.type === 'single')
          return (
            <FilterTextField
              sx={{ flex: 0.25 }}
              key={field.name}
              label={field.label}
              name={field.name}
              value={fieldsState[field.name] as string}
              onChange={handleTextFieldChange}
              onKeyDown={enableTextFieldFilters}
            />
          )
        if (field.type === 'multiple')
          return (
            <FilterAutocompleteMultiple
              sx={{ flex: 0.25 }}
              key={field.name}
              label={field.label}
              name={field.name}
              options={field.options}
              value={fieldsState[field.name] as { label: string; value: string }[]}
              onChange={handleAutocompleteMultipleChange.bind(null, field.name)}
            />
          )
      })}
    </Stack>
  )
}

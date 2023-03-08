import React from 'react'
import { Stack } from '@mui/material'
import type { FiltersProps } from './Filters'
import { FilterTextField } from '../FilterTextField'
import { FilterAutocompleteMultiple } from '../FilterAutocompleteMultiple'
import type { useSearchParams } from 'react-router-dom'
import omit from 'lodash/omit'
import type { ActiveFilters, FieldsState, FiltersParams } from './filters.types'
import { getFiltersFieldsDefaultValues } from './filters.utils'

type FiltersFieldsProps = Pick<FiltersProps, 'fields'> & {
  searchParams: URLSearchParams
  setSearchParams: ReturnType<typeof useSearchParams>[1]
  setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>
  setParams: React.Dispatch<React.SetStateAction<FiltersParams>>
}

export const FiltersFields: React.FC<FiltersFieldsProps> = ({
  fields,
  searchParams,
  setSearchParams,
  setActiveFilters,
  setParams,
}) => {
  const debounceRef = React.useRef<NodeJS.Timeout>()
  const dataQueueRef = React.useRef<FieldsState>({})

  const [fieldsState, setFieldsState] = React.useState<FieldsState>(() =>
    getFiltersFieldsDefaultValues(fields)
  )

  // const handleSubmit = filtersUseFormMethods.handleSubmit((values, a) => {
  //   const paramValues = mapValues(values, (value) =>
  //     Array.isArray(value) ? value.map((v) => v.value) : value
  //   )
  //   setParams(paramValues)
  //   // Filters out the falsy/empty values
  //   const filteredSearchParams = Object.fromEntries(
  //     Object.entries({ ...Object.fromEntries(searchParams), ...paramValues }).filter(
  //       ([_, value]) => !!value && value.length > 0
  //     )
  //   )
  //   setSearchParams(omit({ ...filteredSearchParams }, 'offset'))

  //   // TODO COMMENT
  //   setActiveFilters((prev) => {
  //     Object.entries(values).forEach(([key, _value]) => {
  //       if (Array.isArray(_value)) {
  //         prev.set(key, _value)
  //         return
  //       }
  //       const value = { label: _value, value: _value ?? '' }
  //       prev.set(key, value)
  //     })
  //     return prev
  //   })
  // })

  const enableDebouncedMultipleFieldFilters = () => {
    // TODO
  }

  const enableTextFieldFilters = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    const target = event.target as HTMLInputElement
    const filterKey = target.name
    const value = target.value

    target.blur()
    setFieldsState((prev) => ({ ...prev, [filterKey]: '' }))

    setParams((prev) => ({ ...prev, [filterKey]: value }))
    setActiveFilters((prev) => prev.set(filterKey, value ? { label: value, value } : null))

    const filteredSearchParams = Object.fromEntries(
      Object.entries({ ...Object.fromEntries(searchParams), [filterKey]: value }).filter(
        ([_, value]) => !!value
      )
    )
    setSearchParams(omit({ ...filteredSearchParams }, 'offset'))
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
    dataQueueRef.current = { ...dataQueueRef.current, [filterKey]: data }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(enableDebouncedMultipleFieldFilters, 800)
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

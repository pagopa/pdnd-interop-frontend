import React from 'react'
import { Stack } from '@mui/material'
import omit from 'lodash/omit'
import { ActiveFilterChips } from './ActiveFiltersChips'
import { FiltersFields } from './FiltersFields'
import { useSearchParams } from 'react-router-dom'
import type {
  FilterOption,
  ActiveFilters,
  FiltersParams,
  FieldsState,
  UpdateFilters,
  RemoveFilter,
} from './filters.types'
import {
  getActiveFiltersFromSearchParams,
  getActiveFitlersDefaultValues,
  getFieldStateFromActiveFilters,
  getFiltersFieldsDefaultValues,
  getFiltersFromSearchParams,
  updateSearchParams,
} from './filters.utils'

export type FilterField = {
  name: string
  label: string
} & ({ type: 'multiple'; options: Array<FilterOption> } | { type: 'single' })

export type FiltersProps = {
  params: FiltersParams
  setParams: React.Dispatch<React.SetStateAction<FiltersParams>>
  fields: Array<FilterField>
  isLoadingOptions?: boolean
}

export const Filters: React.FC<FiltersProps> = ({ isLoadingOptions, fields, setParams }) => {
  const hasSetOptions = React.useRef(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [fieldsState, setFieldsState] = React.useState<FieldsState>(() =>
    getFiltersFieldsDefaultValues(fields)
  )
  const [activeFilters, setActiveFilters] = React.useState<ActiveFilters>(() =>
    getActiveFitlersDefaultValues(fields)
  )

  // TODO COMMENT
  if (!hasSetOptions.current && !isLoadingOptions) {
    const entries = [...getActiveFiltersFromSearchParams(searchParams, fields).entries()]
    entries.forEach(([filterKey, value]) => activeFilters.set(filterKey, value))

    setActiveFilters(activeFilters)
    const newFieldsState = getFieldStateFromActiveFilters(activeFilters)
    setFieldsState((prev) => ({ ...prev, ...newFieldsState }))

    hasSetOptions.current = true
  }

  const updateFilters: UpdateFilters = (type, filterKey, value) => {
    if (type === 'single') {
      const tValue = value as string
      setFieldsState((prev) => ({ ...prev, [filterKey]: '' }))
      setParams((prev) => ({ ...prev, [filterKey]: tValue }))
      setActiveFilters((prev) =>
        prev.set(filterKey, tValue ? { label: tValue, value: tValue } : null)
      )
    }

    if (type === 'multiple') {
      const tValue = value as Array<FilterOption>
      const paramValues = { [filterKey]: tValue.map(({ value }) => value) }
      setParams((prev) => ({ ...prev, ...paramValues }))
      setActiveFilters((prev) => {
        prev.set(filterKey, tValue)
        return prev
      })
    }

    const filteredSearchParams = updateSearchParams(searchParams, filterKey, value)
    setSearchParams(omit({ ...filteredSearchParams }, 'offset'))
  }

  const removeFilter: RemoveFilter = (type, filterKey, value) => {
    if (type === 'single') {
      setActiveFilters((prev) => prev.set(filterKey, null))
      setParams((prev) => ({ ...prev, [filterKey]: '' }))
      setSearchParams(omit(getFiltersFromSearchParams(searchParams), filterKey))
    }
    if (type === 'multiple') {
      setActiveFilters((prev) => {
        const values = prev.get(filterKey) as FilterOption[]
        return prev.set(
          filterKey,
          values.filter(({ value: prevValue }) => prevValue !== value)
        )
      })

      setFieldsState((prev) => ({
        ...prev,
        [filterKey]: (prev[filterKey] as Array<FilterOption>).filter(({ value: v }) => v !== value),
      }))

      setParams((prev) => {
        const filterValue = prev[filterKey] as string[]
        return { ...prev, [filterKey]: filterValue.filter((v) => v !== value) }
      })

      // const newSearchParams = getFiltersFromSearchParams(searchParams)
      // if (filterKey in newSearchParams) {
      //   const _filter = newSearchParams[filterKey]
      //   if (Array.isArray(_filter)) {
      //     newSearchParams[filterKey] = _filter.filter((v) => v !== value)
      //   } else {
      //     delete newSearchParams[filterKey]
      //   }
      // }
      // setSearchParams(newSearchParams)
    }
  }

  const clearFilters = () => {
    setFieldsState(getFiltersFieldsDefaultValues(fields))
    setActiveFilters(getActiveFitlersDefaultValues(fields))
    const filtersKeys = fields.map(({ name }) => name)
    setSearchParams(omit(Object.fromEntries(searchParams), ...filtersKeys, 'offset'))
  }

  return (
    <Stack direction="column" spacing={2} justifyContent="space-between" sx={{ mb: 4 }}>
      <FiltersFields
        fields={fields}
        fieldsState={fieldsState}
        setFieldsState={setFieldsState}
        updateFilters={updateFilters}
      />
      <ActiveFilterChips
        activeFilters={activeFilters}
        removeFilter={removeFilter}
        clearFilters={clearFilters}
      />
    </Stack>
  )
}

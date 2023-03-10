import React from 'react'
import type { ActiveFilters, FilterOption, FiltersHandler } from '@/types/filter.types'
import { useSearchParams } from 'react-router-dom'
import type { FilterField } from '@/components/shared/Filters'
import {
  getActiveFiltersDefaultValue,
  getActiveFiltersInitialValue,
  getQueryParamsFromActiveFilters,
  mapActiveFiltersToSearchParams,
} from '@/utils/filter.utils'

export type FiltersHandlers = {
  fields: Array<FilterField>
  activeFilters: ActiveFilters
  onAddActiveFilter: FiltersHandler
  onRemoveActiveFilter: FiltersHandler
  onResetActiveFilters: VoidFunction
}

export function useFilters<TFiltersParams extends Record<string, string | string[] | boolean>>(
  fields: Array<FilterField>
): FiltersHandlers & { filtersParams: TFiltersParams } {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeFilters, setActiveFilters] = React.useState<ActiveFilters>(() =>
    getActiveFiltersInitialValue(searchParams, fields)
  )

  const updateActiveFilters = React.useCallback(
    (newActiveFilters: ActiveFilters) => {
      setSearchParams(mapActiveFiltersToSearchParams(newActiveFilters))
      setActiveFilters(newActiveFilters)
    },
    [setSearchParams]
  )

  const onAddActiveFilter = React.useCallback<FiltersHandler>(
    (type, filterKey, value) => {
      const newActiveFilters = new Map(activeFilters)
      if (type === 'single') {
        const tValue = value as string
        newActiveFilters.set(filterKey, tValue ? { label: tValue, value: tValue } : null)
      }

      if (type === 'multiple') {
        const tValue = value as Array<FilterOption>
        newActiveFilters.set(filterKey, tValue)
      }
      updateActiveFilters(newActiveFilters)
    },
    [updateActiveFilters, activeFilters]
  )

  const onRemoveActiveFilter = React.useCallback<FiltersHandler>(
    (type, filterKey, value) => {
      const newActiveFilters = new Map(activeFilters)

      if (type === 'single') {
        newActiveFilters.set(filterKey, null)
        updateActiveFilters(newActiveFilters)
      }

      if (type === 'multiple') {
        const values = newActiveFilters.get(filterKey) as FilterOption[]
        newActiveFilters.set(
          filterKey,
          values.filter(({ value: prevValue }) => prevValue !== value)
        )
        updateActiveFilters(newActiveFilters)
      }
    },
    [updateActiveFilters, activeFilters]
  )

  const onResetActiveFilters = React.useCallback(() => {
    updateActiveFilters(getActiveFiltersDefaultValue(fields))
  }, [fields, updateActiveFilters])

  const filtersParams = React.useMemo(
    () => getQueryParamsFromActiveFilters(activeFilters) as TFiltersParams,
    [activeFilters]
  )

  return {
    fields,
    filtersParams,
    activeFilters,
    onResetActiveFilters,
    onAddActiveFilter,
    onRemoveActiveFilter,
  }
}

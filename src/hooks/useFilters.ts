import React from 'react'
import type {
  ActiveFilters,
  FilterFields,
  FilterOption,
  FiltersHandler,
  FiltersParams,
} from '@/types/filter.types'
import { useSearchParams } from 'react-router-dom'
import {
  encodeMultipleFilterFieldValue,
  decodeMultipleFilterFieldValue,
  mapSearchParamsToActiveFiltersAndFilterParams,
} from '@/utils/filter.utils'

export type FiltersHandlers = {
  fields: FilterFields
  activeFilters: ActiveFilters
  onChangeActiveFilter: FiltersHandler
  onRemoveActiveFilter: FiltersHandler
  onResetActiveFilters: VoidFunction
}

export function useFilters<TFiltersParams extends FiltersParams>(
  fields: FilterFields
): FiltersHandlers & { filtersParams: TFiltersParams } {
  const [searchParams, setSearchParams] = useSearchParams()

  const onChangeActiveFilter = React.useCallback<FiltersHandler>(
    (type, filterKey, value) => {
      const newSearchParams = new URLSearchParams(searchParams)
      if (value.length === 0) {
        newSearchParams.delete(filterKey)
        setSearchParams(newSearchParams)
        return
      }
      if (type === 'single') {
        newSearchParams.set(filterKey, value as string)
      }
      if (type === 'multiple') {
        const urlParamValue = encodeMultipleFilterFieldValue(value as Array<FilterOption>)
        newSearchParams.set(filterKey, urlParamValue)
      }
      newSearchParams.delete('offset')
      setSearchParams(newSearchParams)
    },
    [searchParams, setSearchParams]
  )

  const onRemoveActiveFilter = React.useCallback<FiltersHandler>(
    (type, filterKey, value) => {
      const newSearchParams = new URLSearchParams(searchParams)

      if (type === 'single') {
        newSearchParams.delete(filterKey)
      }

      if (type === 'multiple') {
        const urlParamsValue = searchParams.get(filterKey)
        if (urlParamsValue) {
          const values = decodeMultipleFilterFieldValue(urlParamsValue)
          const filteredValues = values.filter((option) => option.value !== value)
          if (filteredValues.length === 0) {
            newSearchParams.delete(filterKey)
          } else {
            newSearchParams.set(filterKey, encodeMultipleFilterFieldValue(filteredValues))
          }
        }
      }
      newSearchParams.delete('offset')
      setSearchParams(newSearchParams)
    },
    [searchParams, setSearchParams]
  )

  const onResetActiveFilters = React.useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams)
    const paramKeys = [...newSearchParams.keys()]
    paramKeys.forEach((paramKey) => {
      // Only delete the params that are related to filters
      const isFilterKey = fields.some((field) => field.name === paramKey)
      if (isFilterKey) {
        newSearchParams.delete(paramKey)
      }
    })
    setSearchParams(newSearchParams)
  }, [searchParams, setSearchParams, fields])

  const { activeFilters, filtersParams } = mapSearchParamsToActiveFiltersAndFilterParams(
    searchParams,
    fields
  )

  return {
    fields,
    filtersParams: filtersParams as TFiltersParams,
    activeFilters,
    onResetActiveFilters,
    onChangeActiveFilter,
    onRemoveActiveFilter,
  }
}

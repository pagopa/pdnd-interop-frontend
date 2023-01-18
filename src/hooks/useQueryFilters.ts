import { getKeys } from '@/utils/array.utils'
import React from 'react'
import { DeepPartial, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import omit from 'lodash/omit'

export function useQueryFilters<T extends Record<string, string | string[]>>(_defaultValues: T) {
  const [filtersSearchParams, setFiltersSearchParams] = useSearchParams()

  const decodedSearchParams = React.useMemo<T>(() => {
    const filterKeys = getKeys(_defaultValues) as Array<string>

    return filterKeys.reduce((prev, filterKey) => {
      return {
        ...prev,
        [filterKey]: Array.isArray(_defaultValues[filterKey])
          ? filtersSearchParams.getAll(filterKey) ?? _defaultValues[filterKey]
          : filtersSearchParams.get(filterKey) ?? _defaultValues[filterKey],
      }
    }, {} as T)
  }, [filtersSearchParams, _defaultValues])

  const filtersFormMethods = useForm<T>({
    defaultValues: decodedSearchParams as DeepPartial<T>,
  })

  const [queryFilters, setQueryFilters] = React.useState<T>(decodedSearchParams)

  const clearFilters = React.useCallback(() => {
    const filtersKeys = getKeys(_defaultValues)
    filtersKeys.forEach((filterKey) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      filtersFormMethods.setValue(filterKey, _defaultValues[filterKey])
    })
    setQueryFilters(_defaultValues)
    setFiltersSearchParams(() => omit(Object.fromEntries(filtersSearchParams), ...filtersKeys))
  }, [filtersFormMethods, _defaultValues, filtersSearchParams, setFiltersSearchParams])

  const enableFilters = filtersFormMethods.handleSubmit((values) => {
    setQueryFilters(values)
    setFiltersSearchParams(() => ({ ...Object.fromEntries(filtersSearchParams), ...values }))
  })

  return { queryFilters, filtersFormMethods, enableFilters, clearFilters }
}

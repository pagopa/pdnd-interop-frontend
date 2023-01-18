import { getKeys } from '@/utils/array.utils'
import React from 'react'
import { DeepPartial, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import omit from 'lodash/omit'

export function useQueryFilters<T extends Record<string, string | string[]>>(defaultValues: T) {
  const [filtersSearchParams, setFiltersSearchParams] = useSearchParams()

  // Parses the search url params into a filters object
  const decodedSearchParams = React.useMemo<T>(() => {
    const filterKeys = getKeys(defaultValues) as Array<string>
    return filterKeys.reduce((prev, filterKey) => {
      return {
        ...prev,
        [filterKey]: Array.isArray(defaultValues[filterKey])
          ? filtersSearchParams.getAll(filterKey) ?? defaultValues[filterKey]
          : filtersSearchParams.get(filterKey) ?? defaultValues[filterKey],
      }
    }, {} as T)
  }, [filtersSearchParams, defaultValues])

  const filtersFormMethods = useForm<T>({
    defaultValues: decodedSearchParams as DeepPartial<T>,
  })

  const [queryFilters, setQueryFilters] = React.useState<T>(decodedSearchParams)

  const clearFilters = React.useCallback(() => {
    const filtersKeys = getKeys(defaultValues)

    // Sets the default value to all the form value states
    filtersKeys.forEach((filterKey) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      filtersFormMethods.setValue(filterKey, defaultValues[filterKey])
    })
    setQueryFilters(defaultValues)

    // Clears the search url params from only the filter related url params
    setFiltersSearchParams(omit(Object.fromEntries(filtersSearchParams), ...filtersKeys))
  }, [filtersFormMethods, defaultValues, filtersSearchParams, setFiltersSearchParams])

  const enableFilters = filtersFormMethods.handleSubmit((values) => {
    setQueryFilters(values)

    // Filters out the falsy/empty values
    const filteredSearchParams = Object.fromEntries(
      Object.entries({ ...Object.fromEntries(filtersSearchParams), ...values }).filter(
        ([_, value]) => !!value && value.length > 0
      )
    )

    setFiltersSearchParams(filteredSearchParams)
  })

  return { queryFilters, filtersFormMethods, enableFilters, clearFilters }
}

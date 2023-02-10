import React from 'react'
import { useSearchParams } from 'react-router-dom'
import omit from 'lodash/omit'
import { getKeys } from '@/utils/array.utils'
import { DeepPartial, useForm } from 'react-hook-form'

export function useListingParams<T extends Record<string, string | string[]>>(options: {
  paginationOptions: { limit: number }
  filterParams: T
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const offset = parseInt(searchParams.get('offset') ?? '0', 10)
  const limit = options.paginationOptions.limit

  const pageNum = Math.ceil(offset / limit) + 1
  const filterParams = options.filterParams

  // Parses the search url params into a filters object
  const decodedSearchParams = React.useMemo<T>(() => {
    const filterKeys = Object.keys(filterParams) as Array<string>
    return filterKeys.reduce((prev, filterKey) => {
      return {
        ...prev,
        [filterKey]: Array.isArray(filterParams[filterKey])
          ? searchParams.getAll(filterKey) ?? filterParams[filterKey]
          : searchParams.get(filterKey) ?? filterParams[filterKey],
      }
    }, {} as T)
  }, [searchParams, filterParams])

  const [activeFilters, setActiveFilters] = React.useState<T>(decodedSearchParams)
  const filtersUseFormMethods = useForm<T>({
    defaultValues: decodedSearchParams as DeepPartial<T>,
  })

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      if (newPage < 1) {
        throw new Error(`Number of page ${newPage} is not valid`)
      }
      window.scroll(0, 0)
      const newOffset = (newPage - 1) * limit

      // Syncs the new offset to the "offset" search param
      if (newOffset > 0) {
        setSearchParams(() => ({
          ...Object.fromEntries(searchParams),
          offset: newOffset.toString(),
        }))
        return
      }

      // Removes the search param "offset" if the offset is 0 (page == 1)
      setSearchParams(() => omit(Object.fromEntries(searchParams), 'offset'))
    },
    [limit, searchParams, setSearchParams]
  )

  const clearFilters = React.useCallback(() => {
    const filtersKeys = getKeys(filterParams)

    // Sets the default value to all the form value states
    filtersKeys.forEach((filterKey) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      filtersUseFormMethods.setValue(filterKey, filterParams[filterKey])
    })
    setActiveFilters(filterParams)

    // Clears the search url params from only the filter related url params
    setSearchParams(omit(Object.fromEntries(searchParams), ...filtersKeys, 'offset'))
  }, [filtersUseFormMethods, filterParams, searchParams, setSearchParams])

  const enableFilters = filtersUseFormMethods.handleSubmit((values) => {
    setActiveFilters(values)

    // Filters out the falsy/empty values
    const filteredSearchParams = Object.fromEntries(
      Object.entries({ ...Object.fromEntries(searchParams), ...values }).filter(
        ([_, value]) => !!value && value.length > 0
      )
    )

    setSearchParams(omit({ ...filteredSearchParams }, 'offset'))
  })

  const getTotalPageCount = React.useCallback(
    (totalCount: number | undefined) => {
      return Math.ceil((totalCount ?? 0) / limit)
    },
    [limit]
  )

  const paginationProps = {
    pageNum,
    resultsPerPage: limit,
    onPageChange: handlePageChange,
  }

  const params = { limit, offset, ...activeFilters }

  return {
    params,
    paginationProps,
    getTotalPageCount,
    enableFilters,
    clearFilters,
    filtersUseFormMethods,
  }
}

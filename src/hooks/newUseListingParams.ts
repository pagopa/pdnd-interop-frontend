import React from 'react'
import { useSearchParams } from 'react-router-dom'
import omit from 'lodash/omit'
import { getKeys } from '@/utils/array.utils'
import { DeepPartial, useForm } from 'react-hook-form'

export type Filter<T> = [keyof T, { label: string; value: string | boolean }]

export function useListingParams<
  T extends Record<
    string,
    { label: string; value: string | boolean } | { label: string; value: string | boolean }[]
  >
>(options: { paginationOptions: { limit: number }; filterParams: T }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const offset = parseInt(searchParams.get('offset') ?? '0', 10)
  const limit = options.paginationOptions.limit

  const pageNum = Math.ceil(offset / limit) + 1
  const filterParams = options.filterParams

  /**
   * PAGINATION
   */

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

  /**
   * FILTERS
   */

  const decodedFilterParams = React.useMemo<Filter<T>[]>(() => {
    const filterEntries = Object.entries(filterParams)
    const defaultFilters: Filter<T>[] = []
    filterEntries.forEach((entry) => {
      if (Array.isArray(entry[1])) {
        entry[1].forEach((item) => {
          const filter: Filter<T> = [entry[0], { label: item.label, value: item.value }]
          defaultFilters.push(filter)
        })
      } else {
        const filter: Filter<T> = [entry[0], { label: entry[1].label, value: entry[1].value }]
        defaultFilters.push(filter)
      }
    })
    return defaultFilters
  }, [filterParams])

  // const decodedSearchParams = React.useMemo<Filter<T>[]>(() => {
  //   const filterEntries = Object.entries(filterParams)
  //   const defaultFilters: Filter<T>[] = []
  //   filterEntries.forEach((entry) => {
  //     if (Array.isArray(entry[1])) {
  //       const filterSearchParams = searchParams.getAll(entry[0])
  //       if (filterSearchParams) {
  //         filterSearchParams.forEach((item) => {
  //           const filter: Filter<T> = [
  //             entry[0],
  //             { label: '' /* item.label */, value: item /* item.value */ },
  //           ]
  //           defaultFilters.push(filter)
  //         })
  //       } else {
  //         entry[1].forEach((item) => {
  //           const filter: Filter<T> = [entry[0], { label: item.label, value: item.value }]
  //           defaultFilters.push(filter)
  //         })
  //       }
  //     } else {
  //       const filterSearchParam = searchParams.get(entry[0])
  //       if (filterSearchParam) {
  //         const filter: Filter<T> = [
  //           entry[0],
  //           {
  //             label: '' /* filterSearchParam.label */,
  //             value: filterSearchParam /* filterSearchParam.value */,
  //           },
  //         ]
  //         defaultFilters.push(filter)
  //       } else {
  //         const filter: Filter<T> = [entry[0], { label: entry[1].label, value: entry[1].value }]
  //         defaultFilters.push(filter)
  //       }
  //     }
  //   })
  //   return defaultFilters
  // }, [filterParams, searchParams])

  const [activeFilters, setActiveFilters] = React.useState<Filter<T>[]>(decodedFilterParams)
  const filtersUseFormMethods = useForm<T>({
    defaultValues: decodedFilterParams /* decodedSearchParams */ as DeepPartial<T>,
  })

  const clearFilter = React.useCallback(
    (key: string, element: { label: string; value: string | boolean }) => {
      const newActiveFilters = activeFilters.filter((filter) => {
        filter[0] !== key || filter[1].label !== element.label || filter[1].value !== element.value
      })
      setActiveFilters(newActiveFilters)

      const filterFormValues = [] as Array<{ label: string; value: string | boolean }>
      newActiveFilters
        .filter((item) => item[0] === key)
        .forEach((item) => filterFormValues.push(item[1]))

      filtersUseFormMethods.setValue(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        key,
        filterFormValues.length === 0 ? filterParams[key] : filterFormValues
      )

      // // Clears the search url params from only the filter related url params
      // setSearchParams(omit(Object.fromEntries(searchParams), ...filtersKeys, 'offset'))
    },
    [activeFilters, filterParams, filtersUseFormMethods]
  )

  const clearFilters = React.useCallback(() => {
    const filtersKeys = getKeys(filterParams)

    // Sets the default value to all the form value states
    filtersKeys.forEach((filterKey) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      filtersUseFormMethods.setValue(filterKey, filterParams[filterKey])
    })
    setActiveFilters(decodedFilterParams)

    // Clears the search url params from only the filter related url params
    setSearchParams(omit(Object.fromEntries(searchParams), ...filtersKeys, 'offset'))
  }, [decodedFilterParams, filterParams, filtersUseFormMethods, searchParams, setSearchParams])

  const enableFilters = filtersUseFormMethods.handleSubmit((values) => {
    const valuesEntries = Object.entries(values)
    const filters: Filter<T>[] = []
    valuesEntries.forEach((entry) => {
      if (Array.isArray(entry[1])) {
        entry[1].forEach((item) => {
          const filter: Filter<T> = [entry[0], { label: item.label, value: item.value }]
          filters.push(filter)
        })
      } else {
        const filter: Filter<T> = [entry[0], { label: entry[1].label, value: entry[1].value }]
        filters.push(filter)
      }
    })
    setActiveFilters(filters)

    // // Filters out the falsy/empty values
    // const filteredSearchParams = Object.fromEntries(
    //   Object.entries({ ...Object.fromEntries(searchParams), ...values }).filter(
    //     ([_, value]) => !!value && value.length > 0
    //   )
    // )

    // setSearchParams(omit({ ...filteredSearchParams }, 'offset'))
  })

  const params = { limit, offset, ...activeFilters }

  return {
    params,
    paginationProps,
    getTotalPageCount,
    enableFilters /* TODO */,
    clearFilters,
    filtersUseFormMethods,
    activeFilters,
    clearFilter /* TODO */,
  }
}

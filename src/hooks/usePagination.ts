import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

const paramsSchema = z.coerce.number().int().positive()
const limitSchema = paramsSchema.max(50).catch(10)
const offsetSchema = paramsSchema.catch(0)
const defaultOptions = [10, 24, 36]
/**
 * @description
 * This hook is used to manage the pagination state keeping it in sync with the url params.
 * @param options - An object with a `limit` property used to calculate the current page number. If options has not passed by default limit will be "10".
 * @returns The pagination params, pagination props to be passed to the `Pagination` component and a function to get the total page count.
 * @example
 * const {
 *   paginationParams,
 *   paginationProps,
 *   getTotalPageCount
 * } = usePagination({ limit: 10 })
 *
 * const totalPages = getTotalPageCount(response.totalCount)
 *
 * return (
 *  <MIPagination
 *    page={paginationProps.page}
 *    onChange={(_, page) => paginationProps.onPageChange(page)}
 *    itemsPerPageOptions={paginationProps.itemsPerPageOptions}
 *    count={totalPages}
 *  />
 * )
 *
 */
export function usePagination(options?: { limit: number; limitOptions?: number[] }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const offset = offsetSchema.parse(searchParams.get('offset'))
  const limit = limitSchema.parse(searchParams.get('limit') || options?.limit)
  const limitOptions = options?.limitOptions || defaultOptions

  const pageNum = Math.ceil(offset / limit) + 1

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      if (newPage < 1) {
        throw new Error(`Number of page ${newPage} is not valid`)
      }
      window.scroll(0, 0)
      const newOffset = (newPage - 1) * limit

      // Syncs the new offset to the "offset" search param
      if (newOffset > 0) {
        setSearchParams((searchParams) => {
          searchParams.set('offset', newOffset.toString())
          return searchParams
        })
        return
      }

      // Removes the search param "offset" if the offset is 0 (page == 1)
      setSearchParams((searchParams) => {
        searchParams.delete('offset')
        return searchParams
      })
    },
    [limit, setSearchParams]
  )

  const getTotalPageCount = React.useCallback(
    (totalCount: number | undefined) => {
      return Math.ceil((totalCount ?? 0) / limit)
    },
    [limit]
  )

  const handleLimitChange = React.useCallback(
    (newLimit: number) => {
      if (newLimit < 1) {
        throw new Error(`Number of items per page ${newLimit} is not valid`)
      }

      window.scroll(0, 0)
      setSearchParams((searchParams) => {
        searchParams.set('limit', newLimit.toString())
        searchParams.delete('offset')
        return searchParams
      })
    },
    [setSearchParams]
  )

  const paginationParams = { limit, offset }

  const itemsPerPageOptions = {
    limit,
    options: limitOptions,
    onLimitChange: handleLimitChange,
  }

  const paginationProps = {
    page: pageNum,
    onPageChange: handlePageChange,
    itemsPerPageOptions,
  }

  return {
    paginationParams,
    paginationProps,
    getTotalPageCount,
  }
}

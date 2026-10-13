import { createParser, useQueryState } from 'nuqs'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { z } from 'zod'

const limitValueSchema = z.coerce.number().int().positive().max(50)
const limitSchema = limitValueSchema.catch(10)
const offsetValueSchema = z.coerce.number().int().nonnegative()
const offsetSchema = offsetValueSchema.catch(0)
const defaultOptions = [10, 24, 36]

const limitParser = createParser({
  parse: (data) => limitSchema.parse(data),
  serialize: (data) => String(data),
})

const offsetParser = createParser({
  parse: (data) => offsetSchema.parse(data),
  serialize: (data) => String(data),
})

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
  const location = useLocation()
  const defaultLimit = limitSchema.parse(options?.limit)

  const [limitParam, setLimit] = useQueryState(
    'limit',
    limitParser.withDefault(defaultLimit).withOptions({
      history: 'push',
      scroll: true,
      clearOnDefault: false,
    })
  )
  const [offsetParam, setOffset] = useQueryState(
    'offset',
    offsetParser.withDefault(0).withOptions({
      history: 'push',
      scroll: true,
    })
  )

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const rawLimit = searchParams.get('limit')
    const rawOffset = searchParams.get('offset')

    if (rawLimit === null || !limitValueSchema.safeParse(rawLimit).success) {
      setLimit(defaultLimit)
    }

    if (
      rawOffset !== null &&
      (rawOffset.trim() === '' || !offsetValueSchema.safeParse(rawOffset).success)
    ) {
      setOffset(0)
    }
  }, [defaultLimit, location.search, setLimit, setOffset])

  const limitOptions = options?.limitOptions || defaultOptions

  const pageNum = Math.ceil(offsetParam / limitParam) + 1

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      if (newPage < 1) {
        throw new Error(`Number of page ${newPage} is not valid`)
      }

      const newOffset = (newPage - 1) * limitParam
      setOffset(newOffset)
    },
    [limitParam, setOffset]
  )

  const getTotalPageCount = React.useCallback(
    (totalCount: number | undefined) => {
      return Math.ceil((totalCount ?? 0) / limitParam)
    },
    [limitParam]
  )

  const handleLimitChange = React.useCallback(
    (newLimit: number) => {
      if (newLimit < 1) {
        throw new Error(`Number of items per page ${newLimit} is not valid`)
      }

      setLimit(newLimit)
      setOffset(0)
    },
    [setLimit, setOffset]
  )

  const paginationParams = { limit: limitParam, offset: offsetParam }

  const itemsPerPageOptions = {
    limit: limitParam,
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

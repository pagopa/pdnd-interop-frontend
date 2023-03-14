import React from 'react'
import { useSearchParams } from 'react-router-dom'
import omit from 'lodash/omit'

export function usePagination(options: { limit: number }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const offset = parseInt(searchParams.get('offset') ?? '0', 10)
  const limit = options.limit

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

  const paginationParams = { limit, offset }

  return {
    paginationParams,
    paginationProps,
    getTotalPageCount,
  }
}

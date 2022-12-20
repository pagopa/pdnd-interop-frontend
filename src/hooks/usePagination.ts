import React from 'react'
import { useSearchParams } from 'react-router-dom'
import omit from 'lodash/omit'

/**
 * Contains all the logic needed for the pagination.
 *
 * @returns an object with three properties:
 * - `props` - an object with props to be passed to the `Pagination` component.
 * - `params` - an object with url param to be passed to the paginated service.
 * - `getTotalPageCount` - an utility function that given the total records returns the total page count.
 */
function usePagination(options: { limit: number }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const offset = parseInt(searchParams.get('offset') ?? '0', 10)

  const { limit } = options

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

  const props = React.useMemo(
    () => ({
      pageNum,
      resultsPerPage: limit,
      onPageChange: handlePageChange,
    }),
    [pageNum, limit, handlePageChange]
  )

  const getTotalPageCount = React.useCallback(
    (totalCount: number | undefined) => {
      return Math.ceil((totalCount ?? 0) / limit)
    },
    [limit]
  )

  return React.useMemo(
    () => ({ props, params: { limit, offset }, getTotalPageCount }),
    [limit, offset, getTotalPageCount, props]
  )
}

export default usePagination

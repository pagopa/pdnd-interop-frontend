import { useSearchParams } from 'react-router-dom'
import omit from 'lodash/omit'

function usePagination({ limit }: { limit: number }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const offset = parseInt(searchParams.get('offset') ?? '0')

  const pageNum = Math.ceil(offset / limit) + 1

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) {
      throw new Error(`Number of page ${newPage} is not valid`)
    }
    window.scroll(0, 0)
    const newOffset = (newPage - 1) * limit
    if (newOffset > 0) {
      setSearchParams(() => ({
        ...Object.fromEntries(searchParams),
        offset: newOffset.toString(),
      }))
      return
    }
    setSearchParams(() => omit(Object.fromEntries(searchParams), 'offset'))
  }

  const props = {
    pageNum,
    resultsPerPage: limit,
    onPageChange: handlePageChange,
  }

  const getTotalPageCount = (totalCount: number | undefined) => {
    return Math.ceil((totalCount ?? 0) / limit)
  }

  return { props, params: { limit, offset }, getTotalPageCount }
}

export default usePagination

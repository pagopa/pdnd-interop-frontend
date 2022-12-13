import React from 'react'
import { Pagination as MUIPagination, Stack } from '@mui/material'

type PaginationProps = {
  totalPages: number
  pageNum: number
  resultsPerPage: number

  onPageChange: (numPage: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({ totalPages, onPageChange, pageNum }) => {
  if (totalPages <= 1) return null
  return (
    <Stack sx={{ mt: 2 }} direction="row" justifyContent="end" alignItems="center">
      <MUIPagination
        color="primary"
        page={pageNum}
        count={totalPages}
        onChange={(_, page) => onPageChange(page)}
      />
    </Stack>
  )
}

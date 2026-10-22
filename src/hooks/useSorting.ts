import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { useCallback } from 'react'

export type SortOption = {
  label: string
  value: string
}

export const useSorting = (options: SortOption[], defaultValue?: string) => {
  const [sortBy, setSortBy] = useQueryState(
    'sortBy',
    parseAsStringLiteral(options.map((option) => option.value)).withDefault(
      defaultValue ?? options[0].value
    )
  )

  const onSortingChange = useCallback(
    (value: string) => {
      setSortBy(value)
    },
    [setSortBy]
  )

  return {
    options,
    sortBy,
    onSortingChange,
  }
}

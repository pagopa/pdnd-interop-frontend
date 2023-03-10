import React from 'react'
import { Button, Chip, Divider, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { ActiveFilters, FiltersHandler } from '../../../types/filter.types'
import { mapActiveFiltersToArray } from '../../../utils/filter.utils'

type ActiveFilterChips = {
  activeFilters: ActiveFilters
  onRemoveActiveFilter: FiltersHandler
  onResetActiveFilters: VoidFunction
}

export const ActiveFilterChips: React.FC<ActiveFilterChips> = ({
  activeFilters,
  onRemoveActiveFilter,
  onResetActiveFilters,
}) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const filters = mapActiveFiltersToArray(activeFilters)

  if (filters.length <= 0) return null

  return (
    <>
      {filters.length > 0 && <Divider sx={{ my: 1 }} />}

      <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center" sx={{ width: '100%' }}>
        {filters.map(({ value, label, type, filterKey }) => (
          <Chip
            key={value}
            label={label}
            onDelete={onRemoveActiveFilter.bind(null, type, filterKey, value)}
          />
        ))}
        {filters.length > 1 && (
          <Stack justifyContent="center">
            <Button
              sx={{ ml: 2 }}
              size="small"
              type="button"
              variant="naked"
              onClick={onResetActiveFilters}
            >
              {tCommon('cancelFilter')}
            </Button>
          </Stack>
        )}
      </Stack>
    </>
  )
}

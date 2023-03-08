import React from 'react'
import { Button, Chip, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { noop } from 'lodash'
import type { ActiveFilters } from './filters.types'

type ActiveFilterChips = {
  activeFilters: ActiveFilters
  clearFilter: VoidFunction
  clearFilters: VoidFunction
}

export const ActiveFilterChips: React.FC<ActiveFilterChips> = ({
  activeFilters,
  clearFilter,
  clearFilters,
}) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  if (activeFilters.size <= 0) return null

  return (
    <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ width: '100%' }}>
      {[...activeFilters.entries()].map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(({ value, label }) => <Chip key={value} label={label} onDelete={noop} />)
        }
        if (value === null) return null
        return <Chip key={value.value} label={value.label} onDelete={noop} />
      })}
      {activeFilters.size > 2 && (
        <Button size="small" type="button" variant="naked" onClick={clearFilters}>
          {tCommon('cancelFilter')}
        </Button>
      )}
    </Stack>
  )
}

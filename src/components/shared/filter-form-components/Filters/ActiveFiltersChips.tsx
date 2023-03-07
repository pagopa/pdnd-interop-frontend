import React from 'react'
import { Button, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ActiveFilters } from './Filters'

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
    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
      {activeFilters.size > 2 && (
        <Button size="small" type="button" variant="naked" onClick={clearFilters}>
          {tCommon('cancelFilter')}
        </Button>
      )}
    </Stack>
  )
}

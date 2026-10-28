import type { SortOption } from '@/hooks/useSorting'
import type {
  AdditionalFiltersSection,
  FilterFields,
  FilterFieldsValues,
  FiltersHandler,
} from '@/types/filters.types'
import { Stack, Typography } from '@mui/material'
import { MIButton as Button } from '@pagopa/mui-italia'
import { AdditionalFilters } from './AdditionalFilters'
import { Filters } from './Filters'
import { SortBy } from '../SortBy'
import { Trans, useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { getActiveFiltersCount } from '@/utils/filters.utils'

type FiltersSectionProps = {
  filters: FilterFieldsValues
  fields: FilterFields
  additionals?: AdditionalFiltersSection[]
  onChangeActiveFilters: FiltersHandler
  onResetActiveFilters: VoidFunction
  sorting?: {
    options: SortOption[]
    sortBy: string
    onSortingChange: (value: string) => void
  }
  results?: number
  showResults?: boolean
}

export const FiltersSection: React.FC<FiltersSectionProps> = ({
  filters,
  fields,
  additionals,
  onChangeActiveFilters,
  onResetActiveFilters,
  sorting,
  results,
  showResults = true,
}) => {
  const { t } = useTranslation('filters')

  const hasActiveFilters = useMemo(() => {
    return getActiveFiltersCount(filters) > 0
  }, [filters])
  const hasSortingOptions = Boolean(sorting?.options.length)
  const hasAdditionalFilters = Boolean(additionals?.length)

  return (
    <Stack>
      <Stack mb={2}>
        <Filters fields={fields} filters={filters} onChangeActiveFilters={onChangeActiveFilters} />
        {(showResults || hasAdditionalFilters || hasActiveFilters || hasSortingOptions) && (
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent={'space-between'}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            gap={{ xs: 2, sm: 0 }}
            my={2}
          >
            <Stack direction={'row'} gap={3} alignItems={'center'}>
              {additionals && additionals.length > 0 && (
                <AdditionalFilters
                  fields={additionals}
                  filters={filters}
                  onChangeActiveFilters={onChangeActiveFilters}
                />
              )}
              {hasActiveFilters && (
                <Button variant="text" onClick={onResetActiveFilters}>
                  {t('remove')}
                </Button>
              )}
              {showResults && (
                <Typography variant="body2">
                  <Trans components={{ 1: <strong /> }}>
                    {t('results', { count: results ?? 0 })}
                  </Trans>
                </Typography>
              )}
            </Stack>
            {hasSortingOptions && sorting && <SortBy {...sorting} />}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

import { Stack } from '@mui/material'
import { MainFilters } from './MainFilters'
import { SideFilters } from './SideFilters'
import type {
  FilterFields,
  FilterFieldsValues,
  FiltersHandler,
  SideFiltersSection,
} from '@/types/filters.types'

export type FiltersProps = {
  main: FilterFields
  side?: SideFiltersSection[]
  filters: FilterFieldsValues
  onChangeActiveFilters: FiltersHandler
  onResetActiveFilters: VoidFunction
}

export const Filters: React.FC<FiltersProps> = ({
  main,
  side,
  filters,
  onChangeActiveFilters,
  onResetActiveFilters,
}) => {
  return (
    <Stack spacing={2} alignItems={'flex-start'}>
      <MainFilters fields={main} filters={filters} onChangeActiveFilters={onChangeActiveFilters} />
      {side && (
        <SideFilters
          sections={side}
          filters={filters}
          onChangeActiveFilters={onChangeActiveFilters}
        />
      )}
    </Stack>
  )
}

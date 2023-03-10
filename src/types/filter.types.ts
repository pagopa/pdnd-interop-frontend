export type ActiveFilters = Map<string, (FilterOption | null) | Array<FilterOption>>
export type FieldsValues = Record<string, Array<FilterOption> | string>
export type FilterFieldType = 'multiple' | 'single'
export type FiltersParams = Record<string, string | string[]>

export type FilterOption = { label: string; value: string }

export type UpdateField = (name: string, value: string | Array<FilterOption>) => void
export type UpdateActiveFilters = (value: ActiveFilters) => void

export type FiltersHandler = (
  type: FilterFieldType,
  filterKey: string,
  value: string | Array<FilterOption>
) => void

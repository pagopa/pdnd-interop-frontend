export type ActiveFilters = Map<string, (FilterOption | null) | Array<FilterOption>>
export type FiltersParams = Record<string, string | string[]>
export type FilterFieldType = 'multiple' | 'single'

export type FilterOption = { label: string; value: string }
export type FieldsState = Record<string, Array<FilterOption> | string>

export type UpdateFilters = <Type extends FilterFieldType>(
  type: Type,
  filterKey: string,
  value: Type extends 'single' ? string : Array<FilterOption>
) => void

export type RemoveFilter = (type: FilterFieldType, filterKey: string, value: string) => void

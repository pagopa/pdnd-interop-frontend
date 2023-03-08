export type ActiveFilters = Map<string, (FilterOption | null) | Array<FilterOption>>
export type FiltersParams = Record<string, string | string[]>

export type FilterOption = { label: string; value: string }
export type FieldsState = Record<string, Array<FilterOption> | string>

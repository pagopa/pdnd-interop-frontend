export type ActiveFilters = Array<FilterOption & { type: FilterFieldType; filterKey: string }>
export type FieldsValues = Record<string, Array<FilterOption> | string>
export type FilterFieldType = 'multiple' | 'single'
export type FiltersParams = Record<string, string | string[] | boolean>

export type FilterField = {
  name: string
  label: string
} & (
  | {
      type: 'multiple'
      options: Array<FilterOption>
      setAutocompleteInput?: React.Dispatch<React.SetStateAction<string>>
    }
  | { type: 'single' }
)

export type FilterFields = Array<FilterField>
export type FilterOption = { label: string; value: string }

export type FiltersHandler = (
  type: FilterFieldType,
  filterKey: string,
  value: string | Array<FilterOption>
) => void

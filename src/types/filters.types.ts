export type ActiveFilters = Array<FilterOption & { type: FilterFieldType; filterKey: string }>
export type FilterFieldValue = Array<FilterOption> | FilterOption | string | (Date | null) | boolean

export type FilterFieldsValues = Record<string, FilterFieldValue>
export type FilterFieldType =
  | 'autocomplete-multiple'
  | 'autocomplete-single'
  | 'numeric'
  | 'freetext'
  | 'datepicker'
  | 'select-single'
  | 'select-multiple'
  | 'boolean'
export type FiltersParams = Record<string, string | string[] | boolean>
export type FiltersHandlers = {
  fields: FilterFields
  filters: FilterFieldsValues
  onChangeActiveFilter: FiltersHandler
  onRemoveActiveFilter: FiltersHandler
  onResetActiveFilters: VoidFunction
}

type FilterFieldCommon<TName extends string = string> = {
  /**
   * The name of the filter field.
   * It will be used as the key in the URL search params and as the key in the `filtersParams` returned object.
   */
  name: TName
  /**
   * The label of the filter field.
   */
  label: string
  /**
   * The description of the filter field.
   */
  description?: string
}

export type FreetextFilterFieldOptions<TName extends string = string> = FilterFieldCommon<TName> & {
  type: 'freetext'
}

export type DatepickerFilterFieldOptions<TName extends string = string> =
  FilterFieldCommon<TName> & {
    type: 'datepicker'
    /**
     * The minimum selectable date.
     */
    minDate?: Date
    /**
     * The maximum selectable date.
     */
    maxDate?: Date
  }

export type NumericFilterFieldOptions<TName extends string = string> = FilterFieldCommon<TName> & {
  type: 'numeric'
  /**
   * The minimum value of the numeric filter.
   */
  min?: number
  /**
   * The maximum value of the numeric filter.
   */
  max?: number
}

export type BooleanFilterFieldOptions<TName extends string = string> = FilterFieldCommon<TName> & {
  type: 'boolean'
}

export type AutocompleteFilterFieldOptions<TName extends string = string> =
  FilterFieldCommon<TName> & {
    type: 'autocomplete-multiple' | 'autocomplete-single'
    /**
     * The options of the autocomplete filter.
     * The values must be unique.
     */
    options: Array<FilterOption>
    /**
     * Callback called when the user types in the autocomplete input.
     * @param value The value of the input.
     */
    onTextInputChange?: (value: string) => void
  }

export type SelectFilterFieldOptions<TName extends string = string> = FilterFieldCommon<TName> & {
  type: 'select-multiple' | 'select-single'
  /**
   * The options of the select filter.
   * The values must be unique.
   */
  options: Array<FilterOption>
}

export type FilterField<TName extends string = string> =
  | FreetextFilterFieldOptions<TName>
  | DatepickerFilterFieldOptions<TName>
  | NumericFilterFieldOptions<TName>
  | AutocompleteFilterFieldOptions<TName>
  | SelectFilterFieldOptions<TName>
  | BooleanFilterFieldOptions<TName>

export type FilterFieldCommonProps = {
  field: FilterField
  value: FilterFieldValue
}

export type FilterFields<TName extends string = string> = FilterField<TName>[]

export type FilterOption = { label: string; value: string }

export type FiltersHandler = (values: FilterFieldsValues) => void

export type SideFiltersSection<TName extends string = string> = {
  title: string
  fields: FilterFields<TName>
}

import type {
  ActiveFilters,
  FieldsValues,
  FilterFields,
  FilterOption,
  FiltersParams,
} from '../types/filter.types'

/** Map passed fields options to the field state default value */
export function getFiltersFieldsDefaultValue(fields: FilterFields): FieldsValues {
  return fields.reduce(
    (prev, field) => ({ ...prev, [field.name]: field.type === 'multiple' ? [] : '' }),
    {}
  )
}

/**
 * Get the filter's field initial values object from search params.
 * The initial value of fields of type "single" will always be an empty string,
 * while the initial value of fields of type "multiple" will depend on the
 * url search params
 */
export const getFiltersFieldsInitialValues = (
  searchParams: URLSearchParams,
  filtersFields: FilterFields
) => {
  const fieldsValues: FieldsValues = {}
  filtersFields.forEach((field) => {
    if (field.type === 'multiple') {
      const filterParamValue = searchParams.get(field.name)
      if (filterParamValue) {
        fieldsValues[field.name] = decodeMultipleFilterFieldValue(filterParamValue)
        return
      }
      fieldsValues[field.name] = []
    }
    if (field.type === 'single') {
      fieldsValues[field.name] = ''
    }
  })

  return fieldsValues
}

/**
 * Gets the array of selected filter options and encode them to string with the following format:
 * "[[_OPTION_1_LABEL_, _OPTION_1_VALUE_], [_OPTION_2_LABEL_, _OPTION_2_VALUE_], ...]"
 * */
export const encodeMultipleFilterFieldValue = (value: Array<FilterOption>) =>
  JSON.stringify(value.map(({ value, label }) => [label, value]))

/** Decode the encoded multiple filter field value to an Array<FilterOption> data type */
export const decodeMultipleFilterFieldValue = (urlParamValue: string): Array<FilterOption> => {
  const parsedSearchParams = JSON.parse(urlParamValue) as Array<string>
  return parsedSearchParams.map((field) => ({ label: field[0], value: field[1] }))
}

/**
 * maps the passed searchParams to:
 * - activeFilters: an array used to render the filters chips in the Filters component;
 * - filtersParams: the filters that should be passed as url params to the query request.
 */
export const mapSearchParamsToActiveFiltersAndFilterParams = (
  searchParams: URLSearchParams,
  filtersFields: FilterFields
) => {
  const activeFilters: ActiveFilters = []
  const filtersParams: FiltersParams = {}

  filtersFields.forEach((field) => {
    const filterValue = searchParams.get(field.name)
    if (filterValue) {
      if (field.type === 'single') {
        activeFilters.push({
          value: filterValue,
          label: filterValue,
          type: field.type,
          filterKey: field.name,
        })
        filtersParams[field.name] = filterValue
      }

      if (field.type === 'multiple') {
        const decodedFilterValue = decodeMultipleFilterFieldValue(filterValue)
          .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
          .map((option) => ({ ...option, type: field.type, filterKey: field.name }))

        if (decodedFilterValue.length === 0) return

        activeFilters.push(...decodedFilterValue)
        filtersParams[field.name] = decodedFilterValue.map(({ value }) => value)
      }
    }
  })

  return { activeFilters, filtersParams }
}

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

export const getFiltersFieldsInitialValues = (
  searchParams: URLSearchParams,
  filtersFields: FilterFields
) => {
  const fieldsValues: FieldsValues = {}
  filtersFields.forEach((field) => {
    if (field.type === 'multiple') {
      const filterParamValue = searchParams.get(field.name)
      if (filterParamValue) {
        fieldsValues[field.name] = decodeFilterValue.multiple(filterParamValue)
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

const encodeSingleFilterValue = (value: string) => JSON.stringify([value])
const encodeMultipleFilterValue = (value: Array<FilterOption>) =>
  JSON.stringify(value.map(({ value, label }) => [label, value]))

export const encodeFilterValue = {
  single: encodeSingleFilterValue,
  multiple: encodeMultipleFilterValue,
}

const decodeURLParamSingleFilterValue = (urlParamValue: string): FilterOption => {
  const parsedSearchParams = JSON.parse(urlParamValue)[0] as string
  return { label: parsedSearchParams, value: parsedSearchParams }
}
const decodeURLParamMultipleFilterValue = (urlParamValue: string): Array<FilterOption> => {
  const parsedSearchParams = JSON.parse(urlParamValue) as Array<string>
  return parsedSearchParams
    .map((field) => ({ label: field[0], value: field[1] }))
    .sort((a, b) => {
      if (a.label < b.label) {
        return -1
      }
      if (a.label > b.label) {
        return 1
      }
      return 0
    })
}

export const decodeFilterValue = {
  single: decodeURLParamSingleFilterValue,
  multiple: decodeURLParamMultipleFilterValue,
}

export const mapSearchParamsToActiveFiltersAndFilterParams = (
  searchParams: URLSearchParams,
  filtersFields: FilterFields
) => {
  const activeFilters: ActiveFilters = []
  const filtersParams: FiltersParams = {}

  filtersFields.forEach((field) => {
    const filterParamValue = searchParams.get(field.name)
    if (filterParamValue) {
      if (field.type === 'single') {
        const filterValue = decodeFilterValue.single(filterParamValue)
        activeFilters.push({ ...filterValue, type: field.type, filterKey: field.name })
        filtersParams[field.name] = filterValue.value
      }

      if (field.type === 'multiple') {
        const filterValue = decodeFilterValue.multiple(filterParamValue)
        activeFilters.push(
          ...filterValue.map((option) => ({ ...option, type: field.type, filterKey: field.name }))
        )
        filtersParams[field.name] = filterValue.map(({ value }) => value)
      }
    }
  })

  return { activeFilters, filtersParams }
}

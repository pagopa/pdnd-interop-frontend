import type { FilterField } from '../components/shared/Filters/Filters'
import type {
  ActiveFilters,
  FieldsValues,
  FilterFieldType,
  FilterOption,
} from '../types/filter.types'
import mapValues from 'lodash/mapValues'
import pickBy from 'lodash/pickBy'

/** Map passed fields options to the active fields default value */
export function getActiveFiltersDefaultValue(fields: Array<FilterField>): ActiveFilters {
  return new Map(
    Object.entries(
      fields.reduce(
        (prev, field) => ({
          ...prev,
          [field.name]: field.type === 'multiple' ? [] : null,
        }),
        {}
      )
    )
  ) as ActiveFilters
}

/** Map passed fields options to the field state default value */
export function getFiltersFieldsDefaultValue(fields: Array<FilterField>): FieldsValues {
  return fields.reduce(
    (prev, field) => ({ ...prev, [field.name]: field.type === 'multiple' ? [] : '' }),
    {}
  )
}

export const mapActiveFiltersToArray = (activeFilters: ActiveFilters) => {
  return [...activeFilters.entries()].reduce((prev, [filterKey, value]) => {
    if (Array.isArray(value)) {
      return [
        ...prev,
        ...value.map((v) => ({ ...v, filterKey, type: 'multiple' as FilterFieldType })),
      ]
    }
    if (value !== null) return [...prev, { ...value, filterKey, type: 'single' as FilterFieldType }]
    return prev
  }, [] as Array<FilterOption & { type: FilterFieldType; filterKey: string }>)
}

export const getQueryParamsFromActiveFilters = (activeFilters: ActiveFilters) => {
  const activeFiltersObj = Object.fromEntries(activeFilters)
  const queryParams = mapValues(activeFiltersObj, (value) => {
    if (Array.isArray(value)) {
      return value.map(({ value }) => value)
    }
    return value ? value.value : ''
  })
  return pickBy(queryParams, (param) => !!param && param.length > 0)
}

export const getFiltersFieldInitialValues = (activeFilters: ActiveFilters) => {
  return mapValues(Object.fromEntries(activeFilters), (activeFilterValue) => {
    if (Array.isArray(activeFilterValue)) return activeFilterValue
    return ''
  })
}

const mapSearchParamsToActiveFilters = (searchParams: URLSearchParams) => {
  const entries = Object.fromEntries(searchParams)
  const activeFiltersObj = mapValues(entries, (str) => {
    const parsedSearchParams = JSON.parse(str) as Array<string>

    if (Array.isArray(parsedSearchParams[0])) {
      return parsedSearchParams.map((field) => ({ label: field[0], value: field[1] }))
    }

    return { label: parsedSearchParams[0], value: parsedSearchParams[0] }
  })

  return new Map(Object.entries(activeFiltersObj))
}

export const getActiveFiltersInitialValue = (
  searchParams: URLSearchParams,
  fields: Array<FilterField>
) => {
  const actionFiltersFromFields = getActiveFiltersDefaultValue(fields)
  const activeFiltersFromSearchParams = mapSearchParamsToActiveFilters(searchParams)
  ;[...activeFiltersFromSearchParams.entries()].forEach(([filterKey, value]) =>
    actionFiltersFromFields.set(filterKey, value)
  )

  return actionFiltersFromFields
}

export const mapActiveFiltersToSearchParams = (activeFilters: ActiveFilters) => {
  const entries = Object.entries(Object.fromEntries(activeFilters))
  const searchParams = entries.reduce((prev, [filterKey, filterValue]) => {
    const isArray = Array.isArray(filterValue)
    if (filterValue === null || (isArray && filterValue.length === 0)) return prev

    if (isArray) {
      const stringifiedValue = JSON.stringify(filterValue.map(({ value, label }) => [label, value]))
      return { ...prev, [filterKey]: stringifiedValue }
    }

    const stringifiedValue = JSON.stringify([filterValue.value])
    return { ...prev, [filterKey]: stringifiedValue }
  }, {})
  return searchParams
}

import type { FilterField } from './Filters'
import type { ActiveFilters, FieldsState, FilterFieldType, FilterOption } from './filters.types'

export function getFiltersFieldsDefaultValues(fields: Array<FilterField>): FieldsState {
  return fields.reduce(
    (prev, field) => ({ ...prev, [field.name]: field.type === 'multiple' ? [] : '' }),
    {}
  )
}

export function getActiveFitlersDefaultValues(fields: Array<FilterField>): ActiveFilters {
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
  )
}

export const getActiveFiltersFromSearchParams = (
  searchParams: URLSearchParams,
  fields: Array<FilterField>
) => {
  return fields.reduce((prev, field) => {
    if (field.type === 'multiple') {
      const searchParam = searchParams.getAll(field.name)
      const activeFilters = field.options.filter((option) => searchParam.includes(option.value))
      if (activeFilters.length > 0) prev.set(field.name, activeFilters)
      return prev
    }

    const searchParam = searchParams.get(field.name)
    if (searchParam) prev.set(field.name, { label: searchParam, value: searchParam })
    return prev
  }, new Map() as ActiveFilters)
}

export const getFiltersFromSearchParams = (searchParams: URLSearchParams) => {
  const entries = [...searchParams.entries()]
  return entries.reduce((prev, [filterKey, value]) => {
    const copy = { ...prev }
    if (filterKey in copy) {
      copy[filterKey] = Array.isArray(copy[filterKey])
        ? [...copy[filterKey], value]
        : [copy[filterKey] as string, value]
    } else {
      copy[filterKey] = value
    }

    return copy
  }, {} as Record<string, string | Array<string>>)
}

export const updateSearchParams = (
  searchParams: URLSearchParams,
  filterKey: string,
  value: string | FilterOption[]
) => {
  const defaultSearchParams = getFiltersFromSearchParams(searchParams)
  const updatedSearchParams = {
    ...defaultSearchParams,
    [filterKey]: Array.isArray(value) ? value.map((val) => val.value) : (value as string),
  }

  return Object.fromEntries(
    Object.entries(updatedSearchParams).filter(([_, value]) => !!value && value.length > 0)
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

export const getFieldStateFromActiveFilters = (activeFilters: ActiveFilters) => {
  return [...activeFilters.entries()].reduce(
    (prev, [filterKey, value]) => ({
      ...prev,
      [filterKey]: Array.isArray(value) ? value : '',
    }),
    {} as FieldsState
  )
}

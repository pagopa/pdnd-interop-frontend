import type { FilterField } from './Filters'
import type { ActiveFilters, FieldsState } from './filters.types'

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

import type { FilterFields, FilterFieldsValues, FilterFieldValue } from '@/types/filters.types'
import { match } from 'ts-pattern'

const getDefaultValue = (type: string) => {
  return match(type)
    .with('freetext', () => {
      return ''
    })
    .with('select-single', () => {
      return ''
    })
    .with('select-multiple', () => {
      return []
    })
    .with('datepicker', () => {
      return null
    })
    .with('autocomplete-single', () => {
      return ''
    })
    .with('autocomplete-multiple', () => {
      return []
    })
    .with('numeric', () => {
      return ''
    })
    .with('boolean', () => {
      return false
    })
    .otherwise(() => null)
}

export const getFiltersValues = (fields: FilterFields, filters: FilterFieldsValues) => {
  const values: FilterFieldsValues = {}

  fields.forEach((field) => {
    let value = filters[field.name]

    if (value === undefined || value === null) {
      value = getDefaultValue(field.type)
    }

    values[field.name] = value
  })

  return values
}

export const getFiltersDefaultValues = (fields: FilterFields) => {
  const values: FilterFieldsValues = {}

  fields.forEach((field) => {
    values[field.name] = getDefaultValue(field.type)
  })

  return values
}

export const getActiveFiltersCount = (filters: FilterFieldsValues) => {
  let count = 0
  Object.keys(filters).some((key) => {
    const value = filters[key]
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0) &&
      value !== false
    )
      count++
  })
  return count
}

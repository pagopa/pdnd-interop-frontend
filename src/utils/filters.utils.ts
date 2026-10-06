import type { FilterFields, FilterFieldsValues } from '@/types/filters.types'
import { match } from 'ts-pattern'

export const getFiltersDefaultValues = (fields: FilterFields, filters: FilterFieldsValues) => {
  const values: FilterFieldsValues = {}

  fields.forEach((field) => {
    let value = filters[field.name]

    if (value === undefined || value === null) {
      match(field.type)
        .with('freetext', () => {
          value = ''
        })
        .with('select-single', () => {
          value = ''
        })
        .with('select-multiple', () => {
          value = []
        })
        .with('datepicker', () => {
          value = null
        })
        .with('autocomplete-single', () => {
          value = ''
        })
        .with('autocomplete-multiple', () => {
          value = []
        })
        .with('numeric', () => {
          value = ''
        })
        .with('boolean', () => {
          value = false
        })
        .exhaustive()
    }

    values[field.name] = value
  })

  return values
}

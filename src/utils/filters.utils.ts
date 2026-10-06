import type { FilterFields, FilterFieldsValues } from '@/types/filters.types'

export const getFiltersDefaultValues = (fields: FilterFields, filters: FilterFieldsValues) => {
  const values: FilterFieldsValues = {}

  fields.forEach((field) => {
    let value = filters[field.name]

    if (value === undefined || value === null) {
      switch (field.type) {
        case 'freetext':
          value = ''
          break
        case 'select-single':
          value = ''
          break
        case 'select-multiple':
          value = []
          break
        case 'datepicker':
          value = null
          break
        case 'autocomplete-single':
          value = null
          break
        case 'autocomplete-multiple':
          value = []
          break
        case 'numeric':
          value = null
          break
        case 'boolean':
          value = false
          break
        default:
          value = ''
          break
      }
    }

    values[field.name] = value
  })

  return values
}

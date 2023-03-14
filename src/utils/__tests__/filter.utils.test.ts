import type { FilterFields } from '@/types/filter.types'
import {
  encodeMultipleFilterFieldValue,
  decodeMultipleFilterFieldValue,
  getFiltersFieldsDefaultValue,
  getFiltersFieldsInitialValues,
  mapSearchParamsToActiveFiltersAndFilterParams,
} from '../filter.utils'

const fieldMocks: FilterFields = [
  { name: 'single-field', type: 'single', label: 'Single Filter Field' },
  { name: 'multiple-field', type: 'multiple', options: [], label: 'Multiple Filter Field' },
]

describe('getFiltersFieldsDefaultValue testing', () => {
  it('should create the correct default value based on the field type', () => {
    const result = getFiltersFieldsDefaultValue(fieldMocks)

    expect(result).toEqual({ 'single-field': '', 'multiple-field': [] })
  })
})

describe('getFiltersFieldsInitialValues testing', () => {
  it('should get the correct field initial values from the passed search url params', () => {
    const searchParams = new URLSearchParams({
      'single-field': 'testing',
      'multiple-field': JSON.stringify([
        ['Option 1', 'option-1'],
        ['Option 2', 'option-2'],
      ]),
    })
    const result = getFiltersFieldsInitialValues(searchParams, fieldMocks)

    expect(result).toEqual({
      'single-field': '',
      'multiple-field': [
        {
          label: 'Option 1',
          value: 'option-1',
        },
        {
          label: 'Option 2',
          value: 'option-2',
        },
      ],
    })
  })

  it('should get the correct field initial values when there are no search params', () => {
    const searchParams = new URLSearchParams({})
    const result = getFiltersFieldsInitialValues(searchParams, fieldMocks)

    expect(result).toEqual({
      'single-field': '',
      'multiple-field': [],
    })
  })
})

describe('encodeMultipleFilterFieldValue testing', () => {
  it('should correctly map multiple filter field values to search params value', () => {
    const result = encodeMultipleFilterFieldValue([
      { label: 'Option 1', value: 'option-1' },
      { label: 'Option 2', value: 'option-2' },
    ])
    expect(result).toEqual('[["Option 1","option-1"],["Option 2","option-2"]]')
  })
})

describe('decodeMultipleFilterFieldValue testing', () => {
  it('should correctly map search params value to multiple filter field values', () => {
    const result = decodeMultipleFilterFieldValue(
      '[["Option 1","option-1"],["Option 2","option-2"]]'
    )
    expect(result).toEqual([
      { label: 'Option 1', value: 'option-1' },
      { label: 'Option 2', value: 'option-2' },
    ])
  })
})

describe('mapSearchParamsToActiveFiltersAndFilterParams testing', () => {
  it('should return empty activeFilters and filtersParams if no filter has been set in the search params', () => {
    const searchParams = new URLSearchParams()
    const fields: FilterFields = []
    const result = mapSearchParamsToActiveFiltersAndFilterParams(searchParams, fields)
    expect(result).toMatchInlineSnapshot(`
      {
        "activeFilters": [],
        "filtersParams": {},
      }
    `)
  })

  it('should ignore empty array/strings', () => {
    const searchParams = new URLSearchParams({
      'single-field': '',
      'multiple-field': '[]',
    })
    const result = mapSearchParamsToActiveFiltersAndFilterParams(searchParams, fieldMocks)
    expect(result).toMatchInlineSnapshot(`
      {
        "activeFilters": [],
        "filtersParams": {},
      }
    `)
  })

  it('should correctly map the active filters search url params', () => {
    const searchParams = new URLSearchParams({
      'single-field': 'test-value',
      'multiple-field': '[["Option 1","option-1"],["Option 2","option-2"]]',
    })
    const result = mapSearchParamsToActiveFiltersAndFilterParams(searchParams, fieldMocks)
    expect(result).toMatchInlineSnapshot(`
      {
        "activeFilters": [
          {
            "filterKey": "single-field",
            "label": "test-value",
            "type": "single",
            "value": "test-value",
          },
          {
            "filterKey": "multiple-field",
            "label": "Option 1",
            "type": "multiple",
            "value": "option-1",
          },
          {
            "filterKey": "multiple-field",
            "label": "Option 2",
            "type": "multiple",
            "value": "option-2",
          },
        ],
        "filtersParams": {
          "multiple-field": [
            "option-1",
            "option-2",
          ],
          "single-field": "test-value",
        },
      }
    `)
  })
})

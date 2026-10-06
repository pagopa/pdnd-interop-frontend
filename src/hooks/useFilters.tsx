import type {
  FilterFields,
  FilterFieldsValues,
  FiltersHandler,
  FiltersParams,
  SideFiltersSection,
} from '@/types/filters.types'
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsIsoDate,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
  type SingleParserBuilder as ParserBuilder,
} from 'nuqs'
import { useCallback } from 'react'

type ParsersFor<T> = { [K in keyof T]: ParserBuilder<T[K]> }

type FilterParser =
  | ParserBuilder<string>
  | ParserBuilder<number>
  | ParserBuilder<boolean>
  | ParserBuilder<string[]>
  | ParserBuilder<number[]>
  | ParserBuilder<boolean[]>
  | ParserBuilder<Date>

const getParsers = <T,>(
  main: FilterFields<Extract<keyof T, string>>,
  side: FilterFields<Extract<keyof T, string>> = []
): ParsersFor<T> => {
  const parsers: Partial<Record<Extract<keyof T, string>, FilterParser>> = {}
  ;[...main, ...side].forEach((field) => {
    switch (field.type) {
      case 'freetext':
        parsers[field.name] = parseAsString
        break
      case 'numeric':
        parsers[field.name] = parseAsFloat
        break
      case 'boolean':
        parsers[field.name] = parseAsBoolean
        break
      case 'datepicker':
        parsers[field.name] = parseAsIsoDate
        break
      case 'autocomplete-single':
        parsers[field.name] = parseAsStringLiteral(field.options.map((option) => option.value))
        break
      case 'autocomplete-multiple':
        parsers[field.name] = parseAsArrayOf(
          parseAsStringLiteral(field.options.map((option) => option.value))
        )
        break
      case 'select-single':
        parsers[field.name] = parseAsStringLiteral(field.options.map((option) => option.value))
        break
      case 'select-multiple':
        parsers[field.name] = parseAsArrayOf(
          parseAsStringLiteral(field.options.map((option) => option.value))
        )
        break
    }
  })
  return parsers as unknown as ParsersFor<T>
}

export const useFilters = <TFiltersParams extends FiltersParams>(
  main: FilterFields<Extract<keyof TFiltersParams, string>>,
  side?: SideFiltersSection<Extract<keyof TFiltersParams, string>>[]
) => {
  const parsers: ParsersFor<TFiltersParams> = getParsers<TFiltersParams>(
    main,
    side?.flatMap((section) => section.fields)
  )
  const [filters, setFilters] = useQueryStates(parsers, {
    history: 'push',
  })

  const onChangeActiveFilters = useCallback<FiltersHandler>(
    (values: FilterFieldsValues) => {
      setFilters((previous) => ({ ...previous, ...values }))
    },
    [setFilters]
  )

  const onResetActiveFilters = useCallback(() => {
    setFilters(null)
  }, [setFilters])

  return {
    main,
    side,
    filters,
    onChangeActiveFilters,
    onResetActiveFilters,
  }
}

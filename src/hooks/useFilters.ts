import type {
  AutocompleteFilterFieldOptions,
  FilterFields,
  FilterFieldsValues,
  FiltersHandler,
  FiltersParams,
  SelectFilterFieldOptions,
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
import { match } from 'ts-pattern'

type ParsersFor<T> = { [K in keyof T]: ParserBuilder<T[K]> }

type FilterParser =
  | ParserBuilder<string>
  | ParserBuilder<number>
  | ParserBuilder<boolean>
  | ParserBuilder<string[]>
  | ParserBuilder<number[]>
  | ParserBuilder<boolean[]>
  | ParserBuilder<Date>

const getParsers = <T>(
  main: FilterFields<Extract<keyof T, string>>,
  side: FilterFields<Extract<keyof T, string>> = []
): ParsersFor<T> => {
  const parsers: Partial<Record<Extract<keyof T, string>, FilterParser>> = {}
  ;[...main, ...side].forEach((field) => {
    match(field.type)
      .with('freetext', () => {
        parsers[field.name] = parseAsString
      })
      .with('numeric', () => {
        parsers[field.name] = parseAsFloat
      })
      .with('boolean', () => {
        parsers[field.name] = parseAsBoolean
      })
      .with('datepicker', () => {
        parsers[field.name] = parseAsIsoDate
      })
      .with('autocomplete-single', () => {
        parsers[field.name] = parseAsStringLiteral(
          (field as AutocompleteFilterFieldOptions).options.map((option) => option.value)
        )
      })
      .with('autocomplete-multiple', () => {
        parsers[field.name] = parseAsArrayOf(
          parseAsStringLiteral(
            (field as AutocompleteFilterFieldOptions).options.map((option) => option.value)
          )
        )
      })
      .with('select-single', () => {
        parsers[field.name] = parseAsStringLiteral(
          (field as SelectFilterFieldOptions).options.map((option) => option.value)
        )
      })
      .with('select-multiple', () => {
        parsers[field.name] = parseAsArrayOf(
          parseAsStringLiteral(
            (field as SelectFilterFieldOptions).options.map((option) => option.value)
          )
        )
      })
      .exhaustive()
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

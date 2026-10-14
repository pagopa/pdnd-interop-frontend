import type {
  AutocompleteFilterFieldOptions,
  FilterFields,
  FilterFieldsValues,
  FiltersHandler,
  FiltersParams,
  SelectFilterFieldOptions,
  AdditionalFiltersSection,
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
  fields: FilterFields<Extract<keyof T, string>>,
  additionals: FilterFields<Extract<keyof T, string>> = []
): ParsersFor<T> => {
  const parsers: Partial<Record<Extract<keyof T, string>, FilterParser>> = {}
  ;[...fields, ...additionals].forEach((field) => {
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
        // parsers[field.name] = parseAsArrayOf(
        //   parseAsStringLiteral(
        //     (field as AutocompleteFilterFieldOptions).options.map((option) => option.value)
        //   )
        // )
        // We are using parseAsString here because when using parseAsStringLiteral, the query param is not being parsed correctly when the value is not in the options list(when fetching the list of value from bff).
        // This is because parseAsStringLiteral only allows values that are in the options list. So we are using parseAsString here to allow any value to be passed in the query param.
        parsers[field.name] = parseAsArrayOf(parseAsString)
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
  fields: FilterFields<Extract<keyof TFiltersParams, string>>,
  additionals?: AdditionalFiltersSection<Extract<keyof TFiltersParams, string>>[]
) => {
  const parsers: ParsersFor<TFiltersParams> = getParsers<TFiltersParams>(
    fields,
    additionals?.flatMap((section) => section.fields)
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
    fields,
    additionals,
    filters,
    onChangeActiveFilters,
    onResetActiveFilters,
  }
}

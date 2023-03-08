import React from 'react'
import { Box, Divider, Stack } from '@mui/material'
import noop from 'lodash/noop'
import { FormProvider, useForm } from 'react-hook-form'
import { ActiveFilterChips } from './ActiveFiltersChips'
import { FiltersFields } from './FiltersFields'
import { useSearchParams } from 'react-router-dom'
import mapValues from 'lodash/mapValues'
import omit from 'lodash/omit'

type FilterOption = { label: string; value: string }

export type FilterField = {
  name: string
  label: string
} & ({ type: 'multiple'; options: Array<FilterOption> } | { type: 'single' })

export type FiltersParams = Record<string, string | string[]>

export type ActiveFilters = Map<string, FilterOption | Array<FilterOption>>

export type FiltersProps = {
  params: FiltersParams
  setParams: React.Dispatch<React.SetStateAction<FiltersParams>>
  fields: Array<FilterField>
  isLoadingOptions?: boolean
}

// Parses the search url params into a filters object
const getActiveFilters = (searchParams: URLSearchParams, fields: Array<FilterField>) => {
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

function getUseFormDefaultValues(fields: Array<FilterField>) {
  return fields.reduce(
    (prev, field) => ({ ...prev, [field.name]: field.type === 'multiple' ? [] : '' }),
    {}
  )
}

export const Filters: React.FC<FiltersProps> = ({ isLoadingOptions, fields, setParams }) => {
  const hasSetOptions = React.useRef(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeFilters, setActiveFilters] = React.useState<ActiveFilters>(() => new Map())

  const filtersUseFormMethods = useForm<
    Record<string, Array<{ label: string; value: string }> | string>
  >({
    defaultValues: getUseFormDefaultValues(fields),
  })

  // TODO COMMENT
  if (!hasSetOptions.current && !isLoadingOptions) {
    setActiveFilters(getActiveFilters(searchParams, fields))
    hasSetOptions.current = true
  }

  const handleSubmit = filtersUseFormMethods.handleSubmit((values) => {
    const paramValues = mapValues(values, (value) =>
      Array.isArray(value) ? value.map((v) => v.value) : value
    )
    setParams(paramValues)
    // Filters out the falsy/empty values
    const filteredSearchParams = Object.fromEntries(
      Object.entries({ ...Object.fromEntries(searchParams), ...paramValues }).filter(
        ([_, value]) => !!value && value.length > 0
      )
    )
    setSearchParams(omit({ ...filteredSearchParams }, 'offset'))

    // TODO COMMENT
    setActiveFilters((prev) => {
      Object.entries(values).forEach(([key, _value]) => {
        if (Array.isArray(_value)) {
          if (_value.length > 0) {
            prev.set(key, _value)
            return
          }
          prev.delete(key)
          return
        }
        if (_value) {
          const value = { label: _value, value: _value }
          prev.set(key, value)
          return
        }
        prev.delete(key)
      })
      return prev
    })
  })

  return (
    <FormProvider {...filtersUseFormMethods}>
      <Box onSubmit={handleSubmit} component="form" noValidate>
        <Stack direction="column" spacing={2} justifyContent="space-between" sx={{ mb: 4 }}>
          <FiltersFields fields={fields} />
          <Divider sx={{ my: 1 }} />
          <ActiveFilterChips activeFilters={activeFilters} clearFilter={noop} clearFilters={noop} />
        </Stack>
        <button type="submit" hidden />
      </Box>
    </FormProvider>
  )
}

/**
 * const [params, setParams] = React.useState<FiltersParams>({})
 *
 * return (
 *  <Filters
 *    params={params}
 *    setParams={setParams}
 *    isLoadingOptions={isLoadingConsumersOptions}
 *    filters={[
 *      { name: "eServiceName", label: "Nome e-service", type: "single" },
 *      { name: "consumers", type: "multiple", label: "", options: consumersOptions ?? [] }
 *    ]}
 *  />
 * )
 *
 * Noi "Suspendiamo" solo le chip. I field sono sempre renderizzati.
 * Ci sono filtri attivi nell'url al caricamento?
 *
 * sì -> mostra skeleton mentre carico le opzioni
 * no -> non mostrarle perché non ho bisogno di prendere le label dalle opzioni
 *
 */

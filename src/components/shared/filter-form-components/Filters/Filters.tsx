import React from 'react'
import { Divider, Stack } from '@mui/material'
import noop from 'lodash/noop'
import { FormProvider, useForm } from 'react-hook-form'
import { ActiveFilterChips } from './ActiveFiltersChips'
import { FiltersFields } from './FiltersFields'
import { useSearchParams } from 'react-router-dom'

type FilterOption = { label: string; value: string }

export type FilterField = {
  name: string
  label: string
} & ({ type: 'multiple'; options: Array<FilterOption> } | { type: 'single' })

export type FiltersParams = Record<string, string | number | boolean>

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

export const Filters: React.FC<FiltersProps> = ({ isLoadingOptions, fields }) => {
  const hasSetOptions = React.useRef(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeFilters, setActiveFilters] = React.useState<ActiveFilters>(() => new Map())

  const filtersUseFormMethods = useForm()

  if (!hasSetOptions.current && !isLoadingOptions) {
    setActiveFilters(getActiveFilters(searchParams, fields))
    hasSetOptions.current = true
  }

  return (
    <FormProvider {...filtersUseFormMethods}>
      <Stack
        onSubmit={noop}
        component="form"
        noValidate
        direction="column"
        spacing={2}
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <FiltersFields fields={fields} />
        <Divider sx={{ my: 1 }} />
        <ActiveFilterChips activeFilters={activeFilters} clearFilter={noop} clearFilters={noop} />
      </Stack>
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

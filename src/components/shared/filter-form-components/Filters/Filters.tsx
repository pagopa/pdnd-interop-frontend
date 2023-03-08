import React from 'react'
import { Divider, Stack } from '@mui/material'
import noop from 'lodash/noop'
import { ActiveFilterChips } from './ActiveFiltersChips'
import { FiltersFields } from './FiltersFields'
import { useSearchParams } from 'react-router-dom'
import type { FilterOption, ActiveFilters, FiltersParams } from './filters.types'
import { getActiveFiltersFromSearchParams, getActiveFitlersDefaultValues } from './filters.utils'

export type FilterField = {
  name: string
  label: string
} & ({ type: 'multiple'; options: Array<FilterOption> } | { type: 'single' })

export type FiltersProps = {
  params: FiltersParams
  setParams: React.Dispatch<React.SetStateAction<FiltersParams>>
  fields: Array<FilterField>
  isLoadingOptions?: boolean
}

export const Filters: React.FC<FiltersProps> = ({ isLoadingOptions, fields, setParams }) => {
  const hasSetOptions = React.useRef(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeFilters, setActiveFilters] = React.useState<ActiveFilters>(() =>
    getActiveFitlersDefaultValues(fields)
  )

  // TODO COMMENT
  if (!hasSetOptions.current && !isLoadingOptions) {
    setActiveFilters(getActiveFiltersFromSearchParams(searchParams, fields))
    hasSetOptions.current = true
  }

  return (
    <Stack direction="column" spacing={2} justifyContent="space-between" sx={{ mb: 4 }}>
      <FiltersFields
        fields={fields}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setActiveFilters={setActiveFilters}
        setParams={setParams}
      />
      <Divider sx={{ my: 1 }} />
      <ActiveFilterChips activeFilters={activeFilters} clearFilter={noop} clearFilters={noop} />
    </Stack>
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

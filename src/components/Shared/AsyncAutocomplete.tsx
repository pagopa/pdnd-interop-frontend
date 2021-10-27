import React, { useState } from 'react'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import { Endpoint } from '../../../types'
import { fetchWithLogs } from '../../lib/api-utils'
import debounce from 'lodash/debounce'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { getFetchOutcome } from '../../lib/error-utils'
import { AxiosResponse } from 'axios'

type AutocompleteProps = {
  selected: any
  setSelected: React.Dispatch<React.SetStateAction<any>>
  placeholder: string
  path: Endpoint
  transformFn: any
  labelKey: string
  multiple?: boolean
}

export function AsyncAutocomplete({
  selected,
  setSelected,
  placeholder,
  path,
  transformFn,
  labelKey,
  multiple = false,
}: AutocompleteProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<any[]>([])

  const handleSearch = async (query: string) => {
    setIsLoading(true)

    const searchResponse = await fetchWithLogs({
      path,
      config: { params: { limit: 100, page: 1, search: query } },
    })

    const outcome = getFetchOutcome(searchResponse)

    if (outcome === 'success') {
      setOptions(transformFn((searchResponse as AxiosResponse).data))
    }
    setIsLoading(false)
  }

  const filterBy = () => true

  return (
    <AsyncTypeahead
      multiple={multiple}
      filterBy={filterBy}
      id="async"
      isLoading={isLoading}
      labelKey={labelKey}
      minLength={3}
      onSearch={debounce(handleSearch, 100)}
      onChange={setSelected}
      selected={selected}
      options={options}
      placeholder={placeholder}
      emptyLabel="Nessun risultato trovato"
      promptText="Inserisci almeno 3 caratteri..."
      searchText="Stiamo cercando..."
      renderMenuItemChildren={(option) => (
        <React.Fragment>
          <span>{option[labelKey]}</span>
        </React.Fragment>
      )}
    />
  )
}

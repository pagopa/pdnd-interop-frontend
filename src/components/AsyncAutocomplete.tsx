import React, { useState } from 'react'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import { Endpoint } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import 'react-bootstrap-typeahead/css/Typeahead.css'

type AutocompleteProps = {
  selected: any
  setSelected: React.Dispatch<React.SetStateAction<any>>
  placeholder: string
  endpoint: Endpoint
  transformFn: any
  labelKey: string
}

export function AsyncAutocomplete({
  selected,
  setSelected,
  placeholder,
  endpoint,
  transformFn,
  labelKey,
}: AutocompleteProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<any[]>([])

  const handleSearch = async (query: string) => {
    setIsLoading(true)

    const resp = await fetchWithLogs(endpoint, {
      method: 'GET',
      params: { limit: 100, page: 1, search: query },
    })

    setOptions(transformFn(resp?.data))
    setIsLoading(false)
  }

  const filterBy = () => true

  return (
    <AsyncTypeahead
      filterBy={filterBy}
      id="async"
      isLoading={isLoading}
      labelKey={labelKey}
      minLength={3}
      onSearch={handleSearch}
      onChange={setSelected}
      selected={selected}
      options={options}
      placeholder={placeholder}
      renderMenuItemChildren={(option) => (
        <React.Fragment>
          <span>{option.description}</span>
        </React.Fragment>
      )}
    />
  )
}

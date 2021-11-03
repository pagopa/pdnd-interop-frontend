import React, { useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { Endpoint } from '../../../types'
import { fetchWithLogs } from '../../lib/api-utils'
import { getFetchOutcome } from '../../lib/error-utils'
import { AxiosResponse } from 'axios'
import { debounce, uniqBy } from 'lodash'
import { StyledSpinner } from './StyledSpinner'

type StyledAutocompleteProps = {
  selected: any
  setSelected: any
  placeholder: string
  path: Endpoint
  transformFn: any
  labelKey: string
  multiple?: boolean
}

export function StyledAsyncAutocomplete({
  selected,
  setSelected,
  placeholder,
  path,
  transformFn,
  labelKey,
  multiple = false,
}: StyledAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: any) => {
    if (!e) return

    if (!e.target.value) {
      setOptions([])
      return
    }

    setIsLoading(true)

    const searchResponse = await fetchWithLogs({
      path,
      config: { params: { limit: 100, page: 1, search: e.target.value } },
    })

    const outcome = getFetchOutcome(searchResponse)

    if (outcome === 'success') {
      setOptions(transformFn((searchResponse as AxiosResponse).data))
    }

    setIsLoading(false)
  }

  const open = () => {
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  return (
    <Autocomplete
      multiple={multiple}
      value={selected || ''}
      onChange={setSelected}
      open={isOpen}
      onInputChange={debounce(handleSearch, 100)}
      onOpen={open}
      onClose={close}
      getOptionLabel={(option: any) => (option ? option[labelKey] : '')}
      isOptionEqualToValue={(option, value) => option[labelKey] === value[labelKey]}
      filterOptions={(options) => uniqBy(options, (o) => o[labelKey].toLowerCase())}
      options={options}
      loading={isLoading}
      loadingText="Stiamo cercando..."
      noOptionsText="Nessun risultato trovato"
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            placeholder={placeholder}
            variant="standard"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoading ? <StyledSpinner color="primary" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )
      }}
    />
  )
}

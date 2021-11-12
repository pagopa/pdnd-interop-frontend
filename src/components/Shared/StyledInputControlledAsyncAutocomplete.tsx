import React, { useState } from 'react'
import { Controller } from 'react-hook-form'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import uniqBy from 'lodash/uniqBy'
import { AxiosResponse } from 'axios'
import { Autocomplete, TextField } from '@mui/material'
import { Endpoint } from '../../../types'
import { fetchWithLogs } from '../../lib/api-utils'
import { getFetchOutcome } from '../../lib/error-utils'
import { StyledSpinner } from './StyledSpinner'
import { StyledInputError } from './StyledInputError'
import { InfoMessage } from './InfoMessage'

type StyledInputControlledAsyncAutocompleteProps = {
  label: string
  disabled?: boolean
  infoLabel?: string

  name: string
  defaultValue?: string
  control: any
  rules: any
  errors: any

  placeholder: string
  path: Endpoint
  transformFn: any
  labelKey: string
  multiple?: boolean
}

export function StyledInputControlledAsyncAutocomplete({
  label,
  disabled = false,
  infoLabel,

  name,
  defaultValue,
  control,
  rules,
  errors,

  placeholder,
  path,
  transformFn,
  labelKey,
  multiple = false,
}: StyledInputControlledAsyncAutocompleteProps) {
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

  const hasFieldError = Boolean(!isEmpty(errors) && !isEmpty(get(errors, name)))

  return (
    <React.Fragment>
      <Controller
        shouldUnregister={true}
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => (
          <Autocomplete
            {...field}
            disabled={disabled}
            multiple={multiple}
            open={isOpen}
            onChange={(_, data) => field.onChange(data)}
            onInputChange={debounce(handleSearch, 100)}
            onOpen={open}
            onClose={close}
            getOptionLabel={(option: any) => (option ? option[labelKey] : '')}
            isOptionEqualToValue={(option: any, value: any) => option[labelKey] === value[labelKey]}
            filterOptions={(options) => uniqBy(options, (o) => o[labelKey].toLowerCase())}
            options={options}
            loading={isLoading}
            loadingText="Stiamo cercando..."
            noOptionsText="Nessun risultato trovato"
            renderInput={(params) => {
              return (
                <TextField
                  label={label}
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
                  error={hasFieldError}
                />
              )
            }}
          />
        )}
      />

      {hasFieldError && <StyledInputError error={errors[name]} />}
      {infoLabel && <InfoMessage label={infoLabel} />}
    </React.Fragment>
  )
}

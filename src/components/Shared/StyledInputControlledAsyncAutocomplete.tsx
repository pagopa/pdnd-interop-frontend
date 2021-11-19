import React, { useState } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
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
import { StyledInputWrapper } from './StyledInputWrapper'
import { SxProps } from '@mui/system'

type StyledInputControlledAsyncAutocompleteProps = {
  label: string
  disabled?: boolean
  infoLabel?: string

  name: string
  defaultValue: string[] | string | null // array if multiple = true, string | null if multiple = false
  control: Control<FieldValues, Record<string, unknown>>
  rules: Record<string, unknown>
  errors: Record<string, unknown>

  placeholder: string
  path: Endpoint
  transformFn: (data: Record<string, unknown>) => Array<Record<string, unknown>>
  labelKey: string
  multiple?: boolean
  focusOnMount?: boolean
  sx?: SxProps
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
  focusOnMount = false,
  sx,
}: StyledInputControlledAsyncAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<Array<Record<string, unknown>>>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.SyntheticEvent) => {
    if (!e) return

    const target = e.target as HTMLInputElement
    if (!target.value) {
      setOptions([])
      return
    }

    setIsLoading(true)

    const searchResponse = await fetchWithLogs({
      path,
      config: { params: { limit: 100, page: 1, search: target.value } },
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
    <StyledInputWrapper
      name={name}
      errors={errors}
      sx={sx}
      infoLabel={infoLabel}
      hasFieldError={hasFieldError}
    >
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
            getOptionLabel={(option) => (option ? option[labelKey] : '')}
            isOptionEqualToValue={(option, value) => option[labelKey] === value[labelKey]}
            filterOptions={(options) => uniqBy(options, (o) => o[labelKey].toLowerCase())}
            options={options}
            loading={isLoading}
            loadingText="Stiamo cercando..."
            noOptionsText="Nessun risultato trovato"
            renderInput={(params) => {
              return (
                <TextField
                  autoFocus={focusOnMount}
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
    </StyledInputWrapper>
  )
}

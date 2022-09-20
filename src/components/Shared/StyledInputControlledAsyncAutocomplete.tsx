import React, { useEffect, useState } from 'react'
import debounce from 'lodash/debounce'
import { AxiosResponse } from 'axios'
import {
  Autocomplete,
  Chip,
  CircularProgress,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material'
import { Endpoint } from '../../../types'
import { fetchWithLogs } from '../../lib/api-utils'
import { getFetchOutcome } from '../../lib/error-utils'
import { StyledInputWrapper } from './StyledInputWrapper'
import { SxProps } from '@mui/system'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { useTranslation } from 'react-i18next'

type StyledInputControlledAsyncAutocompleteProps<T> = {
  label: string
  disabled?: boolean
  infoLabel?: string | JSX.Element

  name: string
  onChange: (data: unknown) => void
  error?: string

  variant?: TextFieldProps['variant']
  placeholder: string
  path: Endpoint
  transformFn: (data: Array<T>) => Array<T>
  transformKey?: string
  multiple?: boolean
  divider?: JSX.Element | null
  focusOnMount?: boolean
  sx?: SxProps

  getOptionLabel: (option: T) => string
  isOptionEqualToValue: ((option: T, value: T) => boolean) | undefined
}

export const StyledInputControlledAsyncAutocomplete = <T extends unknown>({
  label,
  disabled = false,
  infoLabel,

  name,
  onChange,
  error,

  variant = 'outlined',
  placeholder,
  path,
  transformFn,
  transformKey,
  multiple = false,
  focusOnMount = false,
  divider = null,
  sx,

  getOptionLabel,
  isOptionEqualToValue,
}: StyledInputControlledAsyncAutocompleteProps<T>) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'styledInputControlledAsyncAutocomplete',
  })
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<Array<T>>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function asyncFetchResults() {
      await fetchResults('')
    }

    asyncFetchResults()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchResults = async (search: string) => {
    setIsLoading(true)

    const searchResponse = await fetchWithLogs({
      path,
      config: { params: { limit: 100, page: 1, search } },
    })

    const outcome = getFetchOutcome(searchResponse)

    if (outcome === 'success') {
      const data = (searchResponse as AxiosResponse).data
      setOptions(transformFn(transformKey ? data[transformKey] : data))
    }

    setIsLoading(false)
  }

  const handleSearch = async (e: React.SyntheticEvent) => {
    if (!e) return
    const target = e.target as HTMLInputElement
    await fetchResults(target.value || '')
  }

  const open = () => {
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  return (
    <StyledInputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      <Autocomplete
        disabled={disabled}
        multiple={multiple}
        open={isOpen}
        onChange={(_, data) => onChange(data)}
        onInputChange={debounce(handleSearch, 100)}
        onOpen={open}
        onClose={close}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        // filterOptions={(options) => uniqBy(options, (o) => (o[labelKey] as string).toLowerCase())}
        options={options}
        loading={isLoading}
        loadingText={t('loadingLabel')}
        noOptionsText={t('noDataLabel')}
        renderInput={(params) => {
          return (
            <TextField
              autoFocus={focusOnMount}
              label={label}
              {...params}
              placeholder={placeholder}
              variant={variant}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {isLoading ? <CircularProgress color="primary" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
              error={Boolean(error)}
            />
          )
        }}
        renderOption={(props, option, { inputValue }) => {
          const label = getOptionLabel(option)
          const matches = match(label, inputValue, { insideWords: true })
          const parts = parse(label, matches)

          return (
            <li {...props}>
              <div>
                {parts.map((part, i) => (
                  <Typography
                    component="span"
                    key={i}
                    sx={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </Typography>
                ))}
              </div>
            </li>
          )
        }}
        renderTags={(value: Array<T>, getTagProps) => (
          <React.Fragment>
            {value.map((option: T, index: number) => (
              <React.Fragment key={index}>
                <Chip // eslint-disable-line react/jsx-key
                  variant="outlined"
                  label={getOptionLabel(option)}
                  {...getTagProps({ index })}
                />
                {index < value.length - 1 ? divider : null}
              </React.Fragment>
            ))}
          </React.Fragment>
        )}
      />
    </StyledInputWrapper>
  )
}

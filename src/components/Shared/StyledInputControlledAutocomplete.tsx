import React, { useEffect, useState } from 'react'
import { Autocomplete, TextField, Typography } from '@mui/material'
import { StyledInputWrapper } from './StyledInputWrapper'
import { SxProps } from '@mui/system'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { useTranslation } from 'react-i18next'

type StyledInputControlledAutocompleteProps<T> = {
  label: string
  disabled?: boolean
  infoLabel?: string | JSX.Element

  name: string
  onChange: (data: T | Array<T> | null) => void
  error?: string

  placeholder: string
  multiple?: boolean
  focusOnMount?: boolean
  sx?: SxProps

  transformFn: (data: Array<T>, search: string) => Array<T>
  getOptionLabel: (option: T) => string
  isOptionEqualToValue: ((option: T, value: T) => boolean) | undefined
  values: Array<T>
}

export const StyledInputControlledAutocomplete = <T extends unknown>({
  label,
  disabled = false,
  infoLabel,

  name,
  onChange,
  error,

  placeholder,
  multiple = false,
  focusOnMount = false,
  sx,

  transformFn,
  getOptionLabel,
  isOptionEqualToValue,
  values,
}: StyledInputControlledAutocompleteProps<T>) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'styledInputControlledAutocomplete',
  })
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<Array<T>>([])

  const getEmptyOptions = () => {
    return transformFn(values, '')
  }

  useEffect(() => {
    if (Boolean(values.length > 0)) {
      setOptions(getEmptyOptions())
    }
  }, [values]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.SyntheticEvent) => {
    if (!e) return

    const target = e.target as HTMLInputElement
    if (!target.value) {
      setOptions(getEmptyOptions())
      return
    }

    const newOptions = transformFn(values, target.value)
    setOptions(newOptions)
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
        onInputChange={handleSearch}
        onOpen={open}
        onClose={close}
        getOptionLabel={getOptionLabel}
        // This prop sometimes throws a warning, due to
        // https://github.com/mui/material-ui/issues/29727
        isOptionEqualToValue={isOptionEqualToValue}
        // filterOptions={(options) => uniqBy(options, (o) => (o[labelKey] as string).toLowerCase())}
        options={options}
        noOptionsText={t('noDataLabel')}
        renderInput={(params) => {
          return (
            <TextField
              autoFocus={focusOnMount}
              label={label}
              {...params}
              placeholder={placeholder}
              variant="outlined"
              InputProps={{ ...params.InputProps }}
              error={Boolean(error)}
              InputLabelProps={{ shrink: true }}
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
      />
    </StyledInputWrapper>
  )
}

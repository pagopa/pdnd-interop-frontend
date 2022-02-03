import React, { useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { StyledInputWrapper } from './StyledInputWrapper'
import { SxProps } from '@mui/system'

type StyledInputControlledAutocompleteProps<T> = {
  label: string
  disabled?: boolean
  infoLabel?: string

  name: string
  onChange: (data: T | Array<T> | null) => void
  error?: string

  placeholder: string
  multiple?: boolean
  focusOnMount?: boolean
  sx?: SxProps

  filterFn: (data: Array<T>, search: string) => Array<T>
  getOptionLabel: ((option: T) => string) | undefined
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

  filterFn,
  getOptionLabel,
  isOptionEqualToValue,
  values,
}: StyledInputControlledAutocompleteProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<Array<T>>([])

  const handleSearch = (e: React.SyntheticEvent) => {
    if (!e) return

    const target = e.target as HTMLInputElement
    if (!target.value) {
      setOptions([])
      return
    }

    const newOptions = filterFn(values, target.value)
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
        isOptionEqualToValue={isOptionEqualToValue}
        // filterOptions={(options) => uniqBy(options, (o) => (o[labelKey] as string).toLowerCase())}
        options={options}
        noOptionsText="Nessun risultato trovato"
        renderInput={(params) => {
          return (
            <TextField
              autoFocus={focusOnMount}
              label={label}
              {...params}
              placeholder={placeholder}
              variant="standard"
              InputProps={{ ...params.InputProps }}
              error={Boolean(error)}
            />
          )
        }}
      />
    </StyledInputWrapper>
  )
}

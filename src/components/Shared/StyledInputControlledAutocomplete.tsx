import React, { useEffect, useState } from 'react'
import { Autocomplete, Chip, TextField, Typography } from '@mui/material'
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

  transformFn?: (data: Array<T>, search: string) => Array<T>
  getOptionLabel: (option: T) => string
  isOptionEqualToValue: ((option: T, value: T) => boolean) | undefined
  options: Array<T>
  defaultValue?: T | Array<T> | null
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

  transformFn = (values: Array<T>, _) => values,
  getOptionLabel,
  isOptionEqualToValue,
  options,
  defaultValue = null,
}: StyledInputControlledAutocompleteProps<T>) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'styledInputControlledAutocomplete',
  })
  const [isOpen, setIsOpen] = useState(false)
  const [_options, _setOptions] = useState<Array<T>>([])
  const [value, setValue] = useState<T | Array<T> | null>(
    multiple && !defaultValue ? [] : defaultValue
  )

  const getEmptyOptions = () => {
    return transformFn(options, '')
  }

  useEffect(() => {
    if (Boolean(options.length > 0)) {
      _setOptions(getEmptyOptions())
    }
  }, [options]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.SyntheticEvent) => {
    if (!e) return

    const target = e.target as HTMLInputElement
    if (!target.value) {
      _setOptions(getEmptyOptions())
      return
    }

    const newOptions = transformFn(options, target.value)
    _setOptions(newOptions)
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
        value={value}
        onChange={(_, data) => {
          setValue(data)
          onChange(data)
        }}
        onInputChange={handleSearch}
        onOpen={open}
        onClose={close}
        getOptionLabel={getOptionLabel}
        // This prop sometimes throws a warning, due to
        // https://github.com/mui/material-ui/issues/29727
        isOptionEqualToValue={isOptionEqualToValue}
        // filterOptions={(options) => uniqBy(options, (o) => (o[labelKey] as string).toLowerCase())}
        options={_options}
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
        renderTags={(value: Array<T>, getTagProps) => (
          <React.Fragment>
            {value.map((option: T, index: number) => (
              <Chip // eslint-disable-line react/jsx-key
                variant="outlined"
                label={getOptionLabel(option)}
                {...getTagProps({ index })}
              />
            ))}
          </React.Fragment>
        )}
      />
    </StyledInputWrapper>
  )
}

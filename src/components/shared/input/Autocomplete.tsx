import React, { useEffect, useState } from 'react'
import {
  Autocomplete as MUIAutocomplete,
  Chip,
  OutlinedInputProps,
  TextField,
  Typography,
} from '@mui/material'
import { SxProps } from '@mui/system'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { useTranslation } from 'react-i18next'
import { InputWrapper } from './InputWrapper'

type AutocompleteProps<T> = {
  label: string
  disabled?: boolean
  infoLabel?: string | JSX.Element

  name: string
  onChange: (data: T | null) => void
  error?: string

  placeholder: string
  focusOnMount?: boolean
  sx?: SxProps

  transformFn?: (data: Array<T>, search: string) => Array<T>
  getOptionLabel: (option: T) => string
  isOptionEqualToValue: ((option: T, value: T) => boolean) | undefined
  options: Array<T>
  defaultValue?: T | null
  InputProps?: Partial<OutlinedInputProps>
}

export function Autocomplete<T>({
  label,
  disabled = false,
  infoLabel,

  name,
  onChange,
  error,

  placeholder,
  focusOnMount = false,
  sx,

  transformFn = (values: Array<T>, _) => values,
  getOptionLabel,
  isOptionEqualToValue,
  options,
  defaultValue = null,
  InputProps = {},
}: AutocompleteProps<T>) {
  const { t } = useTranslation('common')

  const [isOpen, setIsOpen] = useState(false)
  const [_options, _setOptions] = useState<Array<T>>([])
  const [value, setValue] = useState<T | null>(defaultValue)

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
    <InputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      <MUIAutocomplete
        disabled={disabled}
        open={isOpen}
        value={value}
        sx={sx}
        size="small"
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
              name={name}
              autoFocus={focusOnMount}
              label={label}
              {...params}
              placeholder={placeholder}
              variant="outlined"
              InputProps={{ ...params.InputProps, ...InputProps }}
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
    </InputWrapper>
  )
}

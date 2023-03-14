import React from 'react'
import { Autocomplete, Checkbox, TextField } from '@mui/material'
import type { AutocompleteProps } from '@mui/material'
import { useTranslation } from 'react-i18next'
import isEqual from 'lodash/isEqual'
import debounce from 'lodash/debounce'

type FilterAutocompleteMultipleProps = Omit<
  AutocompleteProps<{ label: string; value: string }, true, true, false>,
  'renderInput' | 'onInputChange'
> & {
  name: string
  label: string
  setAutocompleteInput?: React.Dispatch<React.SetStateAction<string>>
}

export const FilterAutocompleteMultiple: React.FC<FilterAutocompleteMultipleProps> = ({
  label,
  options,
  setAutocompleteInput,
  ...props
}) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'autocompleteMultiple',
  })

  const handleAutocompleteInputChange = React.useMemo(
    () =>
      debounce((_: unknown, value: string) => {
        if (value.length >= 3) {
          setAutocompleteInput?.(value)
          return
        }
        setAutocompleteInput?.('')
      }, 300),
    [setAutocompleteInput]
  )

  React.useEffect(() => {
    return () => {
      handleAutocompleteInputChange.cancel()
    }
  }, [handleAutocompleteInputChange])

  return (
    <Autocomplete<{ label: string; value: string }, true, true, false>
      multiple
      options={options}
      isOptionEqualToValue={(option, { value }) => isEqual(option.value, value)}
      loadingText={props.loadingText || t('loadingLabel')}
      noOptionsText={props.noOptionsText || t('noDataLabel')}
      ListboxProps={{
        style: { maxHeight: 200, ...props.ListboxProps?.style },
        ...props.ListboxProps,
      }}
      disableCloseOnSelect
      disableClearable
      renderTags={() => null}
      size="small"
      {...props}
      onInputChange={handleAutocompleteInputChange}
      onChange={(event, data, reason) => {
        if (
          event.type === 'keydown' &&
          (event as React.KeyboardEvent).key === 'Backspace' &&
          reason === 'removeOption'
        ) {
          return
        }
        props?.onChange?.(event, data, reason)
      }}
      renderInput={(params) => {
        return <TextField variant="outlined" {...params} label={label} />
      }}
      renderOption={(props, option, { selected, index }) => {
        const label = option.label
        if (!label) return null

        return (
          <li {...props}>
            <Checkbox key={index} checked={selected} name={label} />
            {label}
          </li>
        )
      }}
    />
  )
}

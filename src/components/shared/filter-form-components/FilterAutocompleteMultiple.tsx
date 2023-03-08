import React from 'react'
import { Autocomplete, Checkbox, TextField } from '@mui/material'
import type { AutocompleteProps } from '@mui/material'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import isEqual from 'lodash/isEqual'

type FilterAutocompleteMultipleProps = Omit<
  AutocompleteProps<{ label: string; value: string }, true, true, false>,
  'renderInput'
> & {
  name: string
  label: string
}

export const FilterAutocompleteMultiple: React.FC<FilterAutocompleteMultipleProps> = ({
  name,
  label,
  options,
  ...props
}) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'autocompleteMultiple',
  })
  return (
    <Controller
      name={name}
      render={({ field: { ref, onChange: _onChange } }) => (
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
          onChange={(event, data, reason) => {
            if (
              event.type === 'keydown' &&
              (event as React.KeyboardEvent).key === 'Backspace' &&
              reason === 'removeOption'
            ) {
              return
            }
            _onChange(data)
          }}
          renderInput={(params) => {
            return <TextField variant="outlined" {...params} label={label} inputRef={ref} />
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
      )}
    />
  )
}

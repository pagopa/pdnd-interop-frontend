import { Chip } from '@mui/material'
import React from 'react'
import { AutocompleteBaseProps, _AutocompleteBase } from './_AutocompleteBase'

type AutocompleteMultipleProps<T> = Omit<
  AutocompleteBaseProps<{ label: string; value: T }, true, false, false>,
  | 'onChange'
  | 'value'
  | 'multiple'
  | 'getOptionLabel'
  | 'renderInput'
  | 'renderOption'
  | 'renderTags'
> & {
  options: Array<{
    label: string
    value: T
  }>
}

export function AutocompleteMultiple<T>(props: AutocompleteMultipleProps<T>) {
  return (
    <_AutocompleteBase
      multiple
      getOptionValue={(data) => data.map((d) => d.value)}
      getOptionLabel={(option) => option.label}
      renderTags={(value, getTagProps) => (
        <React.Fragment>
          {value.map((option, index: number) => (
            <Chip variant="outlined" label={option.label} {...getTagProps({ index })} /> // eslint-disable-line react/jsx-key
          ))}
        </React.Fragment>
      )}
      {...props}
    />
  )
}

import { Chip } from '@mui/material'
import isEqual from 'lodash/isEqual'
import React from 'react'
import { useFormContext } from 'react-hook-form'
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
  const { watch } = useFormContext()
  const selectedValues = watch(props.name) as Array<T>

  return (
    <_AutocompleteBase
      multiple
      getOptionValue={(data) => data.map((d) => d?.value ?? d)}
      renderTags={(_, getTagProps) => {
        const selectedOptions = props.options.filter((option) =>
          selectedValues.some(isEqual.bind(null, option.value))
        )
        return (
          <React.Fragment>
            {selectedOptions.map((option, index: number) => (
              <Chip
                variant="outlined"
                label={option.label}
                {...getTagProps({ index })}
                key={option.label}
              />
            ))}
          </React.Fragment>
        )
      }}
      {...props}
    />
  )
}

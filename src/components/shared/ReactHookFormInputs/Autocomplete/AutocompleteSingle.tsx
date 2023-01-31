import React from 'react'
import isEqual from 'lodash/isEqual'
import { AutocompleteBaseProps, _AutocompleteBase } from './_AutocompleteBase'

type AutocompleteSingleProps<T> = Omit<
  AutocompleteBaseProps<{ label: string; value: T }, false, false, false>,
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

export function AutocompleteSingle<T>(props: AutocompleteSingleProps<T>) {
  return (
    <_AutocompleteBase
      multiple={false}
      getOptionValue={(d) => d?.value ?? d}
      getOptionLabel={(value) =>
        value?.label ?? props.options.find((option) => isEqual(option.value, value))?.label
      }
      {...props}
    />
  )
}

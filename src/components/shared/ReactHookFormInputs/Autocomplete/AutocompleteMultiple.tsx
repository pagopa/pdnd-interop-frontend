import { Chip } from '@mui/material'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { AutocompleteBaseProps, AutocompleteInput, _AutocompleteBase } from './_AutocompleteBase'
import isEqual from 'lodash/isEqual'

type AutocompleteMultipleProps<T> = Omit<
  AutocompleteBaseProps<{ label: string; value: T }, true, false, false>,
  | 'onChange'
  | 'value'
  | 'multiple'
  | 'getOptionLabel'
  | 'renderInput'
  | 'renderOption'
  | 'renderTags'
  | 'setInternalState'
> & {
  options: Array<{
    label: string
    value: T
  }>
}

export function AutocompleteMultiple<T>(props: AutocompleteMultipleProps<T>) {
  const [internalState, setInternalState] = React.useState<AutocompleteInput<T>[]>([])
  const hasSetOptions = React.useRef(false)

  const { watch } = useFormContext()
  const selectedValues = watch(props.name) as Array<T>

  React.useEffect(() => {
    if (hasSetOptions.current) return
    if (selectedValues.length !== internalState.length && props.options.length > 0) {
      hasSetOptions.current = true
      const selectedOptions = props.options.filter((option) =>
        selectedValues.some((value) => isEqual(value, option.value))
      )

      setInternalState(selectedOptions)
    }
  }, [selectedValues, props.options, internalState])

  return (
    <_AutocompleteBase
      multiple
      getOptionValue={(data) => data.map((d) => d?.value ?? d)}
      renderTags={(options, getTagProps) => {
        return (
          <React.Fragment>
            {options
              .filter((option) => selectedValues?.includes(option.value))
              .map((option, index: number) => (
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
      value={internalState}
      setInternalState={setInternalState}
    />
  )
}

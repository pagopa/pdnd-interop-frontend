import React from 'react'
import { Chip } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { _RHFAutocompleteBase } from './_RHFAutocompleteBase'
import type { RHFAutocompleteBaseProps, RHFAutocompleteInput } from './_RHFAutocompleteBase'
import isEqual from 'lodash/isEqual'

export type RHFAutocompleteMultipleProps<T> = Omit<
  RHFAutocompleteBaseProps<{ label: string; value: T }, true, false, false>,
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

export function RHFAutocompleteMultiple<T>(props: RHFAutocompleteMultipleProps<T>) {
  const [internalState, setInternalState] = React.useState<RHFAutocompleteInput<T>[]>([])
  const hasSetOptions = React.useRef(false)

  const { watch } = useFormContext()
  const selectedValues = watch(props.name) as Array<T>

  /**
   * This handles the synchronization between mui autocomplete internal state and react-hook-form state in case options are loaded async
   * and the react-hook-form field state already contains value.
   *
   * This happen on filter fields that have the state already available on page load because it comes from the url params, but not the related
   * option field that comes from an API.
   *
   * */

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

  /**
   * Keeps in sync RHF with the autocomplete's internal state in case
   * a value is deleted manually from the RHF state.
   */
  React.useEffect(() => {
    const subscription = watch((formValues) => {
      const values = formValues[props.name] as Array<T>
      setInternalState((prev) =>
        prev.filter(
          ({ value: internalStateValue }) =>
            !!values.find((value) => isEqual(value, internalStateValue))
        )
      )
    })

    return subscription.unsubscribe
  }, [watch, props.name])

  return (
    <_RHFAutocompleteBase
      multiple
      getOptionValue={(data) => data.map((d) => d?.value ?? d)}
      renderTags={(options, getTagProps) =>
        options
          .filter((option) => selectedValues?.includes(option.value))
          .map((option, index: number) => (
            <Chip
              variant="filled"
              size="small"
              label={option.label}
              {...getTagProps({ index })}
              key={option.label}
            />
          ))
      }
      rules={props.rules}
      onValueChange={props.onValueChange}
      {...props}
      value={internalState}
      setInternalState={setInternalState}
    />
  )
}

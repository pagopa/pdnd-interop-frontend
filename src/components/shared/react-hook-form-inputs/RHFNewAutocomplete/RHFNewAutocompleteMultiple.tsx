import React from 'react'
import type { RHFAutocompleteInput, RHFNewAutocompleteBaseProps } from './RHFNewAutocompleteBase'
import { useFormContext } from 'react-hook-form'
import isEqual from 'lodash/isEqual'
import RHFNewAutocompleteBase from './RHFNewAutocompleteBase'

type RHFNewAutocompleteMultipleProps<T> = Omit<
  RHFNewAutocompleteBaseProps<{ label: string; value: T }, true>,
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

export function RHFNewAutocompleteMultiple<T>(props: RHFNewAutocompleteMultipleProps<T>) {
  const [internalState, setInternalState] = React.useState<RHFAutocompleteInput<T>[]>([])

  const { watch } = useFormContext()
  const selectedValues = watch(props.name) as Array<T> | undefined

  /**
   * This handles the synchronization between mui autocomplete internal state and react-hook-form state in case options are loaded async
   * and the react-hook-form field state already contains value.
   *
   * This happen on filter fields that have the state already available on page load because it comes from the url params, but not the related
   * option field that comes from an API.
   *
   * */

  React.useEffect(() => {
    setInternalState((currentState) => {
      const nextState = (selectedValues ?? []).map((selectedValue) => {
        const availableOption = props.options.find((option) => isEqual(option.value, selectedValue))
        const previousOption = currentState.find((option) => isEqual(option.value, selectedValue))

        return (
          availableOption ??
          previousOption ?? { label: String(selectedValue), value: selectedValue }
        )
      })

      return isEqual(currentState, nextState) ? currentState : nextState
    })
  }, [selectedValues, props.options])

  return (
    <RHFNewAutocompleteBase
      multiple
      getOptionValue={(data) => data.map((d) => d?.value ?? d)}
      isOptionEqualToValue={(option, value) => isEqual(option.value, value.value)}
      {...props}
      rules={props.rules}
      onValueChange={props.onValueChange}
      value={internalState}
      setInternalState={setInternalState}
    />
  )
}

export default RHFNewAutocompleteMultiple

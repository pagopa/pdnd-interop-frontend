import React from 'react'
import isEqual from 'lodash/isEqual'
import {
  type RHFAutocompleteBaseProps,
  type RHFAutocompleteInput,
  _RHFAutocompleteBase,
} from './_RHFAutocompleteBase'
import { useFormContext } from 'react-hook-form'

export type RHFAutocompleteSingleProps<T> = Omit<
  RHFAutocompleteBaseProps<RHFAutocompleteInput<T>, false, false, false>,
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

export function RHFAutocompleteSingle<T>(props: RHFAutocompleteSingleProps<T>) {
  const { watch } = useFormContext()
  const value = watch(props.name) as T
  const hasSetOptions = React.useRef(false)

  const [internalState, setInternalState] = React.useState<RHFAutocompleteInput<T> | null>(null)

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
    if (value && internalState === null && props.options.length > 0) {
      hasSetOptions.current = true
      const selectedOption = props.options.find((option) => isEqual(value, option.value))
      if (selectedOption) {
        setInternalState(selectedOption)
      }
    }
  }, [value, props.options, internalState])

  return (
    <_RHFAutocompleteBase
      multiple={false}
      getOptionValue={(d) => d?.value ?? d}
      getOptionLabel={(value) => {
        if (!value) return ''
        if (value?.label) return value.label

        return props.options.find((option) => isEqual(option.value, value))?.label ?? ''
      }}
      rules={props.rules}
      onValueChange={props.onValueChange}
      {...props}
      value={internalState}
      setInternalState={setInternalState}
    />
  )
}

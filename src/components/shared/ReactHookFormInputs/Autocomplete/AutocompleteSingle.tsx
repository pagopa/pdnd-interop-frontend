import React from 'react'
import isEqual from 'lodash/isEqual'
import { AutocompleteBaseProps, AutocompleteInput, _AutocompleteBase } from './_AutocompleteBase'
import { useFormContext } from 'react-hook-form'

type AutocompleteSingleProps<T> = Omit<
  AutocompleteBaseProps<AutocompleteInput<T>, false, false, false>,
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

export function AutocompleteSingle<T>(props: AutocompleteSingleProps<T>) {
  const { watch } = useFormContext()
  const value = watch(props.name) as T
  const hasSetOptions = React.useRef(false)

  const [internalState, setInternalState] = React.useState<AutocompleteInput<T> | null>(null)

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
    <_AutocompleteBase
      multiple={false}
      getOptionValue={(d) => d?.value ?? d}
      getOptionLabel={(value) => {
        if (!value) return ''
        if (value?.label) return value.label

        return props.options.find((option) => isEqual(option.value, value))?.label ?? ''
      }}
      {...props}
      value={internalState}
      setInternalState={setInternalState}
    />
  )
}

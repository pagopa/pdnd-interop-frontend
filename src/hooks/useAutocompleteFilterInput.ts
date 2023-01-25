import React from 'react'
import debounce from 'lodash/debounce'

/**
 * This is an utility hook made for the autocomplete filters that calls an API on text input change in order to query the options.
 * It debounces the state change to limit the API calls, and ignores the text input change when it is less than 3 chars.
 *
 * @returns the text input state and the handleAutocompleteInputChange callback to put inside the `onInputChange` of the `AutocompleteMultiple` component.
 *
 */
export function useAutocompleteFilterInput(initialState = '') {
  const [autocompleteInput, setAutocompleteInput] = React.useState(initialState)

  const handleAutocompleteInputChange = React.useMemo(
    () =>
      debounce((_: unknown, value: string) => {
        if (value.length >= 3) {
          setAutocompleteInput(value)
          return
        }
        setAutocompleteInput('')
      }, 300),
    []
  )

  React.useEffect(() => {
    return () => {
      handleAutocompleteInputChange.cancel()
    }
  }, [handleAutocompleteInputChange])

  return [autocompleteInput, handleAutocompleteInputChange] as const
}

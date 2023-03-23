import React from 'react'
import debounce from 'lodash/debounce'

/**
 * A custom React hook that provides an autocomplete filter input with debouncing functionality.
 * It should be used when the MUI's autocomplete text input is used as a search query for fetching
 * autocomplete options.
 * @param {string} initialState - The initial state value for the input. Default is an empty string.
 * @returns {readonly [string, (value: string) => void]} An array with two elements:
 * - The current value of the autocomplete filter input
 * - A debounced function to update the value of the autocomplete filter input
 */
export function useAutocompleteTextInput(
  initialState = ''
): readonly [string, (value: string) => void] {
  const [autocompleteInput, setAutocompleteInput] = React.useState(initialState)

  /**
   * A memoized debounce function that sets the autocomplete input value if the input length is
   * greater than or equal to 3, and clears the input otherwise.
   */
  const setDebouncedAutocompleteInput = React.useMemo(
    () =>
      debounce((value: string) => {
        if (value.length >= 3) {
          setAutocompleteInput(value)
          return
        }
        setAutocompleteInput('')
      }, 300),
    []
  )

  return [autocompleteInput, setDebouncedAutocompleteInput] as const
}

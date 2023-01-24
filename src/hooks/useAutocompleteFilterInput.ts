import React from 'react'
import debounce from 'lodash/debounce'

export function useAutocompleteFilterInput() {
  const [autocompleteInput, setAutocompleteInput] = React.useState('')

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

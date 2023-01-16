import React from 'react'
import { useForm } from 'react-hook-form'

export function useQueryFilters<T>(defaultValues: Omit<T, 'offset' | 'limit'>) {
  const filtersFormMethods = useForm<any>({ defaultValues })
  const [queryFilters, setQueryFilters] = React.useState(defaultValues)

  const clearFilters = React.useCallback(() => {
    filtersFormMethods.reset()
    setQueryFilters(defaultValues)
  }, [filtersFormMethods, defaultValues])

  const enableFilters = filtersFormMethods.handleSubmit((values) => {
    setQueryFilters(values)
  })

  return { queryFilters, filtersFormMethods, enableFilters, clearFilters }
}

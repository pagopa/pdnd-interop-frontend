import React from 'react'
import { DeepPartial, useForm } from 'react-hook-form'

export function useQueryFilters<T extends object>(defaultValues: T) {
  const filtersFormMethods = useForm<T>({
    defaultValues: defaultValues as DeepPartial<T>,
  })

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

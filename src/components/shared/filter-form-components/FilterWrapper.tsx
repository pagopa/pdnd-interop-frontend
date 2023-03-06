import { Button, Chip, Stack } from '@mui/material'
import React, { useMemo } from 'react'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export type FilterWrapperProps = {
  filtersUseFormMethods: UseFormReturn<any, unknown>
  activeFilters: [string, { label: string; value: string | boolean }][]
  clearFilters: VoidFunction
  clearFilter: (key: string, element: { label: string; value: string | boolean }) => void
  enableFilters: VoidFunction
  children?: React.ReactNode
}

export const FilterWrapper: React.FC<FilterWrapperProps> = ({
  filtersUseFormMethods,
  activeFilters = [],
  clearFilters,
  clearFilter,
  enableFilters,
  children,
}) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  console.log(Object.entries(activeFilters).toString())

  const buildChipFilters = useMemo(() => {
    const chipFiltersArray: React.ReactNode[] = []
    activeFilters
      // .sort((a, b) => {
      //   return a[0] < b[0] ? 1 : 0
      // })
      // TODO fare funzione di sorting sulla base della key
      .forEach((filter) => {
        chipFiltersArray.push(
          <Chip
            variant="filled"
            size="small"
            label={filter[1].label}
            key={filter[1].value as string}
            onDelete={() => clearFilter(filter[0], filter[1])}
          />
        )
      })
    return chipFiltersArray
  }, [activeFilters, clearFilter])

  return (
    <FormProvider {...filtersUseFormMethods}>
      <Stack
        onSubmit={enableFilters}
        component="form"
        noValidate
        direction="column"
        spacing={2}
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          {children}
        </Stack>
        {activeFilters && activeFilters.length > 0 && (
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            {/* {buildChipFilters()} */}
            {/* <Chip variant="filled" size="small" label="aaaaaa" /> */}
            {activeFilters.length > 2 && (
              <Button size="small" type="button" variant="naked" onClick={clearFilters}>
                {tCommon('cancelFilter')}
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </FormProvider>
  )
}

import React from 'react'
import { Stack } from '@mui/material'
import { FiltersProps } from './Filters'
import { FilterTextField } from '../FilterTextField'
import { FilterAutocompleteMultiple } from '../FilterAutocompleteMultiple'

export const FiltersFields: React.FC<Pick<FiltersProps, 'fields'>> = ({ fields }) => {
  return (
    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
      {fields.map((field) => {
        if (field.type === 'single')
          return (
            <FilterTextField
              sx={{ flex: 0.25 }}
              key={field.name}
              label={field.label}
              name={field.name}
            />
          )
        if (field.type === 'multiple')
          return (
            <FilterAutocompleteMultiple
              sx={{ flex: 0.25 }}
              key={field.name}
              label={field.label}
              name={field.name}
              options={field.options}
            />
          )
      })}
    </Stack>
  )
}

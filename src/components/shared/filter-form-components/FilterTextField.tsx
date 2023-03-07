import React from 'react'
import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { Controller, useFormContext } from 'react-hook-form'

export type FilterTextFieldProps = MUITextFieldProps & {
  name: string
}

export const FilterTextField: React.FC<FilterTextFieldProps> = ({ name, InputProps, ...props }) => {
  const { formState } = useFormContext()
  const error = formState.errors[name]?.message as string | undefined

  return (
    <Controller
      name={name}
      render={({ field: { ref, onChange: _onChange, ...fieldProps } }) => (
        <MUITextField
          size="small"
          {...props}
          error={!!error}
          inputRef={ref}
          InputProps={{
            ...InputProps,
            endAdornment: <SearchIcon sx={{ color: 'gray' }} />,
          }}
          {...fieldProps}
        />
      )}
    />
  )
}

import React from 'react'
import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { Controller } from 'react-hook-form'

export type FilterTextFieldProps = MUITextFieldProps & {
  name: string
}

export const FilterTextField: React.FC<FilterTextFieldProps> = ({ name, InputProps, ...props }) => {
  return (
    <Controller
      name={name}
      render={({ field: { ref, ...fieldProps } }) => (
        <MUITextField
          size="small"
          {...props}
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

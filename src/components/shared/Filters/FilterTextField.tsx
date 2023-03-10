import React from 'react'
import { TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

export const FilterTextField: React.FC<TextFieldProps> = ({ InputProps, ...props }) => {
  return (
    <TextField
      size="small"
      {...props}
      InputProps={{
        ...InputProps,
        endAdornment: <SearchIcon sx={{ color: 'gray' }} />,
      }}
    />
  )
}

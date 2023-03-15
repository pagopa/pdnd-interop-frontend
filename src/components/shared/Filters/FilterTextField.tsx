import React from 'react'
import { IconButton, TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'

type FilterTextField = TextFieldProps & {
  onIconClick: VoidFunction
}

export const FilterTextField: React.FC<FilterTextField> = ({
  InputProps,
  onIconClick,
  ...props
}) => {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })
  return (
    <TextField
      size="small"
      {...props}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <IconButton sx={{ mx: -1 }} onClick={onIconClick}>
            <SearchIcon aria-label={t('filter')} />
          </IconButton>
        ),
      }}
    />
  )
}

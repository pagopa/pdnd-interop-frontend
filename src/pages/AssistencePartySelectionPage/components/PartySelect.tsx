import React from 'react'
import { IconButton, InputAdornment, List, TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { PartySelectItem } from './PartySelectItem'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'

type PartySelectProps = {
  selected: number | null
  onSelect: (value: number | null) => void
}

export const PartySelect: React.FC<PartySelectProps> = ({ selected, onSelect }) => {
  const { t } = useTranslation('assistance', { keyPrefix: 'partySelection' })

  if (selected) {
    return (
      <PartySelectItem
        component="div"
        secondaryAction={
          <IconButton
            onClick={() => onSelect(null)}
            edge="end"
            aria-label={t('deselectButtonLabel')}
          >
            <CloseIcon />
          </IconButton>
        }
      />
    )
  }

  return (
    <>
      <TextField
        fullWidth
        size="small"
        label={t('textFieldLabel')}
        autoFocus
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <List
        sx={{
          mt: 2,
          maxHeight: 220,
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'rgb(230, 233, 242) 10px 10px inset',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(0, 115, 230)',
            borderRadius: '16px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        {[...Array(10)].map((_, index) => (
          <PartySelectItem key={index} onClick={() => onSelect(index + 1)} />
        ))}
      </List>
    </>
  )
}

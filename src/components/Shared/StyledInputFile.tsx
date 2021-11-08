import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

type StyledInputFileProps = {
  id: string
  onChange: any
  value?: any
  label: string
}

export function StyledInputFile({ id, onChange, value, label }: StyledInputFileProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ mr: 3, flexShrink: 0, position: 'relative' }}>
        <Box
          component="input"
          type="file"
          id={id}
          onChange={onChange}
          sx={{ position: 'absolute', width: '100%', height: '100%' }}
        />

        <Box
          component="label"
          htmlFor={id}
          sx={{
            zIndex: 1,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            px: 4,
            py: 2,
            position: 'relative',
            borderRadius: 1,
          }}
          color="common.white"
          bgcolor="primary.main"
        >
          <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
        </Box>
      </Box>
      <Typography component="span">
        File selezionato: <strong>{value ? value.name : 'nessun file selezionato'}</strong>
      </Typography>
    </Box>
  )
}

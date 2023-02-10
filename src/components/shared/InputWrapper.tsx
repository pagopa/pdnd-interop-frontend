import React from 'react'
import { SxProps } from '@mui/system'
import { InputError } from './InputError'
import { Box, Theme, Typography } from '@mui/material'

type InputWrapperProps = {
  error?: string
  infoLabel?: string | JSX.Element
  sx?: SxProps<Theme>
  children: React.ReactNode
}

export const InputWrapper: React.FC<InputWrapperProps> = ({ error, sx, infoLabel, children }) => {
  return (
    <Box sx={{ my: 4, ...sx }}>
      {children}
      {Boolean(error) && <InputError error={{ message: error }} />}
      {infoLabel && (
        <Typography sx={{ mt: 0.5 }} variant="caption" component="p" color="text.secondary">
          {infoLabel}
        </Typography>
      )}
    </Box>
  )
}

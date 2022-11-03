import React from 'react'
import { SxProps } from '@mui/system'
import { InputError } from './InputError'
import { Box, Theme, Typography } from '@mui/material'

type InputWrapperProps = {
  name: string
  error?: string
  infoLabel?: string | JSX.Element
  sx?: SxProps<Theme>
  children: React.ReactNode
}

export const InputWrapper: React.FC<InputWrapperProps> = ({
  error,
  sx = { my: 4 },
  infoLabel,
  children,
}) => {
  return (
    <Box sx={sx}>
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

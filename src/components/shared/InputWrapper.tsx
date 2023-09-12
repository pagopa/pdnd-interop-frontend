import React from 'react'
import { FormControl, FormHelperText } from '@mui/material'
import type { Theme, SxProps } from '@mui/material'

type InputWrapperProps = {
  error?: string
  infoLabel?: React.ReactNode
  sx?: SxProps<Theme>
  children: React.ReactNode
  infoLabelId?: string
  errorId?: string
  component?: React.ElementType
}

export const InputWrapper: React.FC<InputWrapperProps> = ({
  infoLabelId,
  errorId,
  error,
  sx,
  infoLabel,
  children,
  component = 'div',
}) => {
  const helperTextSx = { fontWeight: 400, color: 'text.secondary', ml: 0, display: 'block' }

  return (
    <FormControl fullWidth component={component} error={!!error} sx={{ my: 2, ...sx }}>
      {children}

      {error && (
        <FormHelperText component="span" id={errorId} sx={helperTextSx}>
          {error}
        </FormHelperText>
      )}
      {infoLabel && (
        <FormHelperText component="span" id={infoLabelId} error={false} sx={helperTextSx}>
          {infoLabel}
        </FormHelperText>
      )}
    </FormControl>
  )
}

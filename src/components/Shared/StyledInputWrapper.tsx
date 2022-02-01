import React, { FunctionComponent } from 'react'
import { Box, SxProps } from '@mui/system'
import { StyledInputError } from './StyledInputError'
import { InfoMessage } from './InfoMessage'

type StyledInputWrapperProps = {
  name: string
  error?: string
  infoLabel?: string
  sx?: SxProps
}

export const StyledInputWrapper: FunctionComponent<StyledInputWrapperProps> = ({
  error,
  sx = { my: 6 },
  infoLabel,
  children,
}) => {
  return (
    <Box sx={sx}>
      {children}
      {Boolean(error) && <StyledInputError error={{ message: error }} />}
      {infoLabel && <InfoMessage label={infoLabel} />}
    </Box>
  )
}

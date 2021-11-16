import React, { FunctionComponent } from 'react'
import get from 'lodash/get'
import { Box } from '@mui/system'
import { StyledInputError } from './StyledInputError'
import { InfoMessage } from './InfoMessage'

type StyledInputWrapperProps = {
  errors: any
  name: string
  infoLabel?: string
  hasFieldError: boolean
  sx?: any
}

export const StyledInputWrapper: FunctionComponent<StyledInputWrapperProps> = ({
  errors,
  name,
  sx = { my: 6 },
  infoLabel,
  hasFieldError,
  children,
}) => {
  return (
    <Box sx={sx}>
      {children}
      {hasFieldError && <StyledInputError error={get(errors, name)} />}
      {infoLabel && <InfoMessage label={infoLabel} />}
    </Box>
  )
}

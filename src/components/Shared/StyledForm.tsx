import React, { FunctionComponent } from 'react'
import { Box, SxProps } from '@mui/material'

type StyledFormProps = {
  sx?: SxProps
  onSubmit: React.FormEventHandler<HTMLFormElement>
}

export const StyledForm: FunctionComponent<StyledFormProps> = ({ children, sx = {}, onSubmit }) => {
  return (
    <Box component="form" noValidate sx={sx} onSubmit={onSubmit}>
      {children}
    </Box>
  )
}

import React, { FunctionComponent } from 'react'
import { CircularProgress, CircularProgressProps } from '@mui/material'

export const StyledSpinner: FunctionComponent<CircularProgressProps> = (props) => (
  <CircularProgress {...props} />
)

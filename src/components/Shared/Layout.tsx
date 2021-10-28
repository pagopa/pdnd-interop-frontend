import React, { FunctionComponent } from 'react'
import { Container } from '@mui/material'

export const Layout: FunctionComponent = ({ children }) => {
  return <Container maxWidth={false}>{children}</Container>
}

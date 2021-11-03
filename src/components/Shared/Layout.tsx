import React, { FunctionComponent } from 'react'
import { Container, ContainerProps } from '@mui/material'

export const Layout: FunctionComponent<ContainerProps> = ({ sx, children }) => {
  return (
    <Container sx={sx} maxWidth={false}>
      {children}
    </Container>
  )
}

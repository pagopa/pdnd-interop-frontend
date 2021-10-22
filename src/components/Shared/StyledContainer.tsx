import React, { FunctionComponent } from 'react'
import { Container, ContainerProps } from 'react-bootstrap'

export const StyledContainer: FunctionComponent<ContainerProps> = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>
}

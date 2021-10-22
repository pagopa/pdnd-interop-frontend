import React, { FunctionComponent } from 'react'
import { StyledContainer } from './StyledContainer'
import { StyledRow } from './StyledRow'

export const Layout: FunctionComponent = ({ children }) => {
  return (
    <StyledContainer>
      <StyledRow>{children}</StyledRow>
    </StyledContainer>
  )
}

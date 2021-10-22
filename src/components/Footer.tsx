import React from 'react'
import { StyledContainer } from './Shared/StyledContainer'
import { StyledRow } from './Shared/StyledRow'

export function Footer() {
  return (
    <footer className="bg-white py-4">
      <StyledContainer>
        <StyledRow>
          <div>Portale Interoperabilità — PagoPA S.p.A. 2021 ©</div>
        </StyledRow>
      </StyledContainer>
    </footer>
  )
}

import React from 'react'
import { StyledContainer } from './Shared/StyledContainer'
import { StyledRow } from './Shared/StyledRow'

export function PageTitle() {
  return (
    <div className="bg-white">
      <StyledContainer>
        <StyledRow>
          <h1 className="bg-white py-4">Portale interoperabilità</h1>
        </StyledRow>
      </StyledContainer>
    </div>
  )
}

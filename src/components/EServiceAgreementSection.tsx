import React from 'react'
import { StyledInputFile } from './StyledInputFile'
import { WhiteBackground } from './WhiteBackground'

type EServiceAgreementSectionProps = {
  todoLoadAccordo: any
}

export function EServiceAgreementSection({ todoLoadAccordo }: EServiceAgreementSectionProps) {
  return (
    <WhiteBackground>
      <h2>Accordo di interoperabilità*</h2>

      <StyledInputFile onChange={todoLoadAccordo} id="accordo" />
    </WhiteBackground>
  )
}

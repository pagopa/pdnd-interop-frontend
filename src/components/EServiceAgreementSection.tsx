import React from 'react'
import { StyledInputFile } from './StyledInputFile'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'

type EServiceAgreementSectionProps = {
  todoLoadAccordo: any
}

export function EServiceAgreementSection({ todoLoadAccordo }: EServiceAgreementSectionProps) {
  return (
    <WhiteBackground>
      <StyledIntro>
        {{
          title: 'Accordo di interoperabilità*',
        }}
      </StyledIntro>

      <StyledInputFile onChange={todoLoadAccordo} id="accordo" />
    </WhiteBackground>
  )
}

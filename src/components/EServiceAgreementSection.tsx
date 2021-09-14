import React from 'react'
import { StyledInputSelect } from './StyledInputSelect'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'

type EServiceAgreementSectionProps = {
  todoLoadAccordo: (e: any) => void
}

export function EServiceAgreementSection({ todoLoadAccordo }: EServiceAgreementSectionProps) {
  const options = [
    { value: '1', label: 'Template 1' },
    { value: '2', label: 'Template 2' },
    { value: '3', label: 'Template 3' },
    { value: '4', label: 'Template 4' },
    { value: '5', label: 'Template 5' },
  ]

  return (
    <WhiteBackground>
      <StyledIntro>
        {{
          title: 'Accordo di interoperabilità*',
          description:
            'Seleziona il template di accordo che intendi proporre per sottoscrivere il servizio',
        }}
      </StyledIntro>

      <StyledInputSelect
        id="accordo"
        label="Seleziona template"
        disabled={false}
        options={options}
        onChange={todoLoadAccordo}
      />
    </WhiteBackground>
  )
}

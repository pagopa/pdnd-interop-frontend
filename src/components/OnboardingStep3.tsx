import React, { useContext } from 'react'
import { StepperStepComponentProps, User } from '../../types'
import { UserContext } from '../lib/context'
import { getAccessionAgreement, getAccessionAgreementAttachments } from '../lib/legal'
import { OnboardingStepActions } from './OnboardingStepActions'
import { StyledAccordion } from './Shared/StyledAccordion'
import { StyledContainer } from './Shared/StyledContainer'
import { StyledIntro } from './Shared/StyledIntro'

export function OnboardingStep3({ forward, back, data }: StepperStepComponentProps) {
  const { user } = useContext(UserContext)
  const agreement = getAccessionAgreement(data.partyPeople.admin, data.party, user!)
  const delegates = (Object.values(data.partyPeople) as User[]).filter((p) => p.role !== 'Manager')
  const attachments = getAccessionAgreementAttachments(delegates)

  return (
    <StyledContainer className="container-align-left form-max-width">
      <StyledIntro>
        {{
          title: 'Verifica i dati e i termini dell’accordo di adesione*',
          description:
            'Questo è l’accordo che ti verrà inviato via mail da firmare e restituire per l’attivazione dell’account sulla piattaforma interoperabilità.',
        }}
      </StyledIntro>
      <div className="mt-4 mb-3 bg-secondary rounded px-3 py-3 shadow">{agreement}</div>

      <div className="my-4">
        <StyledAccordion entries={attachments} />
      </div>

      <OnboardingStepActions
        back={{ action: back, label: 'indietro', disabled: false }}
        forward={{ action: forward, label: 'invia', disabled: false }}
      />
    </StyledContainer>
  )
}

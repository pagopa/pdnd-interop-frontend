import { Box } from '@mui/system'
import React, { useContext } from 'react'
import { StepperStepComponentProps, User } from '../../types'
import { UserContext } from '../lib/context'
import { getAccessionAgreement, getAccessionAgreementAttachments } from '../lib/legal'
import { OnboardingStepActions } from './OnboardingStepActions'
import { StyledAccordion } from './Shared/StyledAccordion'
import { StyledIntro } from './Shared/StyledIntro'

export function OnboardingStep3({ forward, back, data }: StepperStepComponentProps) {
  const { user } = useContext(UserContext)
  const agreement = getAccessionAgreement(data.partyPeople.admin, data.party, user!)
  const delegates = (Object.values(data.partyPeople) as User[]).filter((p) => p.role !== 'Manager')
  const attachments = getAccessionAgreementAttachments(delegates)

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'Verifica i dati e i termini dell’accordo di adesione*',
          description:
            'Questo è l’accordo che ti verrà inviato via mail da firmare e restituire per l’attivazione dell’account sulla piattaforma interoperabilità.',
        }}
      </StyledIntro>
      <Box bgcolor="grey.500" sx={{ mt: '1.5rem', mb: '1rem', p: '1rem', boxShadow: 3 }}>
        {agreement}
      </Box>

      <Box sx={{ my: '1rem' }}>
        <StyledAccordion entries={attachments} />
      </Box>

      <OnboardingStepActions
        back={{ action: back, label: 'Indietro', disabled: false }}
        forward={{ action: forward, label: 'Invia', disabled: false }}
      />
    </React.Fragment>
  )
}

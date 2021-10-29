import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Typography } from '@mui/material'
import {
  PartyOnCreate,
  RequestOutcome,
  RequestOutcomeOptions,
  StepperStep,
  User,
} from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { getFetchOutcome } from '../lib/error-utils'
import { scrollToTop } from '../lib/page-utils'
import { StyledStepper } from '../components/Shared/StyledStepper'
import { OnboardingStep1 } from '../components/OnboardingStep1'
import { OnboardingStep2 } from '../components/OnboardingStep2'
import { OnboardingStep3 } from '../components/OnboardingStep3'
import { LoadingOverlay } from '../components/Shared/LoadingOverlay'
import { MessageNoAction } from '../components/Shared/MessageNoAction'
import emailIllustration from '../assets/email-illustration.svg'
import redXIllustration from '../assets/red-x-illustration.svg'
import { InlineSupportLink } from '../components/Shared/InlineSupportLink'
import { StyledLink } from '../components/Shared/StyledLink'

export function Onboarding() {
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [partyPeople, setPartyPeople] = useState<{ [key: string]: User }>()
  const [party, setParty] = useState<PartyOnCreate>()
  const [outcome, setOutcome] = useState<RequestOutcome>()
  const history = useHistory()

  const reload = () => {
    history.go(0)
  }

  const back = () => {
    setActiveStep(activeStep - 1)
  }

  const forward = () => {
    setActiveStep(activeStep + 1)
    scrollToTop()
  }

  const forwardWithUser = (newPartyPeople: { [key: string]: User }) => {
    setPartyPeople(newPartyPeople)
    forward()
  }

  const forwardWithParty = (newParty: PartyOnCreate) => {
    setParty(newParty)
    forward()
  }

  const submit = async () => {
    setLoading(true)

    const formData = {
      institutionId: party!.institutionId,
      users: Object.values(partyPeople!),
    }

    const postLegalsResponse = await fetchWithLogs({
      path: { endpoint: 'ONBOARDING_POST_LEGALS' },
      config: { data: formData },
    })

    setLoading(false)

    // Check the outcome
    const outcome = getFetchOutcome(postLegalsResponse)

    setOutcome(outcome)
  }

  const STEPS: StepperStep[] = [
    { label: "Seleziona l'ente", component: OnboardingStep1 },
    { label: 'Inserisci i dati', component: OnboardingStep2 },
    { label: "Verifica l'accordo", component: OnboardingStep3 },
  ]

  const stepsProps = [
    { forward: forwardWithParty },
    { forward: forwardWithUser, back },
    { forward: submit, back, data: { partyPeople, party } },
  ]

  const Step = STEPS[activeStep].component

  const outcomeContent: RequestOutcomeOptions = {
    success: {
      img: { src: emailIllustration, alt: "Icona dell'email" },
      title: 'Ci siamo quasi...',
      description: [
        <Typography>
          Per completare la registrazione, segui le istruzioni che trovi nella mail che ti abbiamo
          inviato a <strong>{party?.digitalAddress}</strong>
        </Typography>,
        <Typography>
          Non hai ricevuto nessuna mail? Attendi qualche minuto e controlla anche nello spam. Se non
          arriva, <InlineSupportLink />
        </Typography>,
      ],
    },
    error: {
      img: { src: redXIllustration, alt: "Icona dell'email" },
      title: "C'è stato un problema...",
      description: [
        <Typography>
          Il salvataggio dei dati inseriti non è andato a buon fine.{' '}
          <StyledLink component="button" onClick={reload}>
            Prova nuovamente a registrarti
          </StyledLink>
          , e se il problema dovesse persistere, <InlineSupportLink />!
        </Typography>,
      ],
    },
  }

  return !outcome ? (
    <React.Fragment>
      <StyledStepper steps={STEPS} activeIndex={activeStep} />
      <Step {...stepsProps[activeStep]} />
      {loading && <LoadingOverlay loadingText="Stiamo verificando i tuoi dati" />}
    </React.Fragment>
  ) : (
    <MessageNoAction {...outcomeContent[outcome]} />
  )
}

import React, { useState } from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import {
  IPACatalogParty,
  RequestOutcome,
  RequestOutcomeOptions,
  StepperStep,
  User,
} from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { getFetchOutcome } from '../lib/error-utils'
import { scrollToTop } from '../lib/page-utils'
import { OnboardingStep1 } from '../components/OnboardingStep1'
import { OnboardingStep2 } from '../components/OnboardingStep2'
import { OnboardingStep3 } from '../components/OnboardingStep3'
import { LoadingOverlay } from '../components/Shared/LoadingOverlay'
import { MessageNoAction } from '../components/Shared/MessageNoAction'
import successIllustration from '../assets/success-illustration.svg'
import errorIllustration from '../assets/error-illustration.svg'
import { InlineSupportLink } from '../components/Shared/InlineSupportLink'
import { StyledButton } from '../components/Shared/StyledButton'
import { useHistory } from 'react-router'
import { ROUTES } from '../config/routes'

export function Onboarding() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [partyPeople, setPartyPeople] = useState<Record<string, User>>({})
  const [party, setParty] = useState<IPACatalogParty>()
  const [outcome, setOutcome] = useState<RequestOutcome>()

  const goHome = () => {
    history.push(ROUTES.LOGIN.PATH)
  }

  const back = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault()
    setActiveStep(activeStep - 1)
  }

  const forward = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault()
    setActiveStep(activeStep + 1)
    scrollToTop()
  }

  const forwardWithManager = (managerObject: Record<string, User>) => {
    setPartyPeople({ ...partyPeople, ...managerObject })
    forward()
  }

  const forwardWithParty = (newParty: IPACatalogParty) => {
    setParty(newParty)
    forward()
  }

  const submit = async (delegatesObject: Record<string, User>) => {
    const usersObject = { ...partyPeople, ...delegatesObject }
    setPartyPeople(usersObject)

    setLoading(true)

    if (!party) return
    const formData = { institutionId: party.id, users: Object.values(usersObject) }

    const postLegalsResponse = await fetchWithLogs({
      path: { endpoint: 'ONBOARDING_POST_LEGALS' },
      config: { data: formData },
    })

    setLoading(false)

    // Check the outcome
    const outcome = getFetchOutcome(postLegalsResponse)

    setOutcome(outcome)
  }

  const STEPS: Omit<StepperStep, 'label'>[] = [
    { component: OnboardingStep1 },
    { component: OnboardingStep2 },
    { component: OnboardingStep3 },
  ]

  const stepsProps = [
    { forward: forwardWithParty, data: { partyPeople, party } },
    { forward: forwardWithManager, back, data: { partyPeople, party } },
    { forward: submit, back, data: { partyPeople, party } },
  ]

  const Step = STEPS[activeStep].component

  const outcomeContent: RequestOutcomeOptions = {
    success: {
      img: { src: successIllustration, alt: 'Icona che rappresenta successo' },
      title: 'La tua richiesta è stata inviata con successo',
      description: (
        <React.Fragment>
          <Typography sx={{ mb: 2 }}>
            Per completare la registrazione, segui le istruzioni che trovi nella mail inviata a{' '}
            <strong>{party?.digitalAddress}</strong>
          </Typography>{' '}
          <Typography>
            Se non hai ricevuto nessuna mail, attendi qualche minuto e verifica anche tra lo spam.
            <br />
            Se ancora non arriva, <InlineSupportLink />.
          </Typography>
          <StyledButton sx={{ mt: 6 }} size="small" variant="contained" onClick={goHome}>
            Torna al portale
          </StyledButton>
        </React.Fragment>
      ),
    },
    error: {
      img: { src: errorIllustration, alt: 'Icona che rappresenta errore' },
      title: 'Spiacenti, qualcosa è andato storto',
      description: (
        <React.Fragment>
          <Typography>
            A causa di un errore del sistema non è possibile completare la procedura.
            <br />
            Ti chiediamo di riprovare più tardi.
          </Typography>
          <StyledButton sx={{ mt: 6 }} size="small" variant="contained" onClick={goHome}>
            Torna al portale
          </StyledButton>
        </React.Fragment>
      ),
    },
  }

  return !outcome ? (
    <React.Fragment>
      <Box sx={{ textAlign: 'center' }}>
        <Step {...stepsProps[activeStep]} />
      </Box>
      {loading && <LoadingOverlay loadingText="Stiamo verificando i tuoi dati" />}
    </React.Fragment>
  ) : (
    <MessageNoAction {...outcomeContent[outcome]} />
  )
}

import React, { useState } from 'react'
import { RequestOutcome, RequestOutcomeOptions, StepperStep, User } from '../../types'
import { Stepper } from '../components/Stepper'
import { WhiteBackground } from '../components/WhiteBackground'
import { OnboardingStep1 } from '../components/OnboardingStep1'
import { OnboardingStep2 } from '../components/OnboardingStep2'
import { OnboardingStep3 } from '../components/OnboardingStep3'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { fetchWithLogs } from '../lib/api-utils'
import { MessageNoAction } from '../components/MessageNoAction'
import emailIllustration from '../assets/email-illustration.svg'
import redXIllustration from '../assets/red-x-illustration.svg'
import { getFetchOutcome } from '../lib/error-utils'
import { useHistory } from 'react-router-dom'
import { InlineSupportLink } from '../components/InlineSupportLink'

type FormData = {
  institutionId: string
  users: User[]
}

export function Onboarding() {
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<Partial<FormData>>()
  const [legalEmail, setLegalEmail] = useState('')
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
  }

  const forwardWithData = (newFormData: Partial<FormData>) => {
    setFormData({ ...formData, ...newFormData })
    forward()
  }

  const forwardWithDataAndEmail = (newFormData: Partial<FormData>, newLegalEmail: string) => {
    setLegalEmail(newLegalEmail)
    forwardWithData(newFormData)
  }

  const submit = async () => {
    setLoading(true)

    const postLegalsResponse = await fetchWithLogs({
      path: { endpoint: 'ONBOARDING_POST_LEGALS' },
      config: { data: formData },
    })

    setLoading(false)

    // Check the outcome
    const outcome = getFetchOutcome(postLegalsResponse)

    setOutcome(outcome)
  }

  const steps: StepperStep[] = [
    {
      label: "Seleziona l'ente",
      Component: () => OnboardingStep1({ forward: forwardWithDataAndEmail }),
    },
    {
      label: 'Inserisci i dati',
      Component: () => OnboardingStep2({ forward: forwardWithData, back }),
    },
    {
      label: "Verifica l'accordo",
      Component: () => OnboardingStep3({ forward: submit, back }),
    },
  ]

  const Step = steps[activeStep].Component

  const outcomeContent: RequestOutcomeOptions = {
    success: {
      img: { src: emailIllustration, alt: "Icona dell'email" },
      title: 'Ci siamo quasi...',
      description: [
        <p>
          Per completare la registrazione, segui le istruzioni che trovi nella mail che ti abbiamo
          inviato a <strong>{legalEmail}</strong>
        </p>,
        <p>
          Non hai ricevuto nessuna mail? Attendi qualche minuto e controlla anche nello spam. Se non
          arriva, <InlineSupportLink />
        </p>,
      ],
    },
    error: {
      img: { src: redXIllustration, alt: "Icona dell'email" },
      title: "C'è stato un problema...",
      description: [
        <p>
          Il salvataggio dei dati inseriti non è andato a buon fine.{' '}
          <button className="reset-btn btn-as-link link-default" onClick={reload}>
            Prova nuovamente a registrarti
          </button>
          , e se il problema dovesse persistere, <InlineSupportLink />!
        </p>,
      ],
    },
  }

  return !outcome ? (
    <React.Fragment>
      <WhiteBackground stickToTop={true}>
        <Stepper steps={steps} activeIndex={activeStep} />
      </WhiteBackground>
      <Step />
      {loading && <LoadingOverlay loadingText="Stiamo verificando i tuoi dati" />}
    </React.Fragment>
  ) : (
    <MessageNoAction {...outcomeContent[outcome]} />
  )
}

import React, { useState } from 'react'
import { Outcomes, StepperStep, User } from '../../types'
import { Stepper } from '../components/Stepper'
import { WhiteBackground } from '../components/WhiteBackground'
import { withLogin } from '../components/withLogin'
import { OnboardingStep1 } from '../components/OnboardingStep1'
import { OnboardingStep2 } from '../components/OnboardingStep2'
import { OnboardingStep3 } from '../components/OnboardingStep3'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { fetchWithLogs } from '../lib/api-utils'
import { MessageNoAction } from '../components/MessageNoAction'
import emailIllustration from '../assets/email-illustration.svg'

type FormData = {
  institutionId: string
  users: User[]
}

function OnboardingComponent() {
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({ institutionId: '', users: [] })
  const [legalEmail, setLegalEmail] = useState('')
  const [outcome, setOutcome] = useState<number>()

  const back = () => {
    setActiveStep(activeStep - 1)
  }

  const forward = () => {
    setActiveStep(activeStep + 1)
  }

  const forwardWithData = (newFormData: any) => {
    setFormData({ ...formData, ...newFormData })
    forward()
  }

  const forwardWithDataAndEmail = (newFormData: any, newLegalEmail: string) => {
    setLegalEmail(newLegalEmail)
    forwardWithData(newFormData)
  }

  const submit = async () => {
    setLoading(true)

    const response = await fetchWithLogs(
      { endpoint: 'ONBOARDING_POST_LEGALS' },
      { method: 'POST', data: formData }
    )

    setLoading(false)
    setOutcome(response?.status)
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

  const outcomeContent: Outcomes = {
    201: {
      img: { src: emailIllustration, alt: "Icona dell'email" },
      title: 'Ci siamo quasi...',
      description: [
        <p>
          Per completare la registrazione, segui le istruzioni che trovi nella mail che ti abbiamo
          inviato a <strong>{legalEmail}</strong>
        </p>,
        <p>
          Non hai ricevuto nessuna mail? Attendi qualche minuto e controlla anche nello spam. Se non
          arriva,{' '}
          <a className="link-default" href="#0" title="Contatta l\'assistenza">
            contattaci!
          </a>
        </p>,
      ],
    },
    400: {
      img: { src: emailIllustration, alt: "Icona dell'email" },
      title: "C'è stato un problema...",
      description: [
        <p>
          Il salvataggio dei dati inseriti non è andato a buon fine. Prova nuovamente a registrarti,
          e se il problema dovesse persistere,{' '}
          <a className="link-default" href="#0" title="Contatta l\'assistenza">
            contattaci
          </a>
          !
        </p>,
      ],
    },
  }

  return !outcome ? (
    <LoadingOverlay isLoading={loading} loadingText="Stiamo verificando i tuoi dati">
      <WhiteBackground stickToTop={true}>
        <Stepper steps={steps} activeIndex={activeStep} />
      </WhiteBackground>
      <Step />
    </LoadingOverlay>
  ) : (
    <MessageNoAction
      title={outcomeContent[outcome].title}
      img={outcomeContent[outcome].img}
      description={outcomeContent[outcome]!.description}
    />
  )
}

export const Onboarding = withLogin(OnboardingComponent)

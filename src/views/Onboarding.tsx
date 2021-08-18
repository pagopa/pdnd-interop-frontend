import React, { useContext, useState } from 'react'
import { StepperStep, StepperStepComponentProps } from '../../types'
import { Stepper } from '../components/Stepper'
import { WhiteBackground } from '../components/WhiteBackground'
import { withLogin } from '../components/withLogin'
import { UserContext } from '../lib/context'
import { Row, Button, Form, FloatingLabel } from 'react-bootstrap'

function Step1({ stepForward }: StepperStepComponentProps) {
  const { user } = useContext(UserContext)

  return (
    <WhiteBackground>
      <Row>
        <h3>
          Ciao, {user?.name} {user?.surname}
        </h3>
        <p>
          Per registrarti alla piattaforma di interoperabilità, seleziona il tuo l’ente di
          riferimento dall’elenco IPA.
          <br />
          Se non trovi il tuo ente nell’elenco,{' '}
          <a
            className="link-dark fw-bold"
            href="https://example.com"
            title="Go to example.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            scopri qui
          </a>{' '}
          come aggiungerti.
        </p>
      </Row>

      <ActionSteps forwardAction={stepForward} forwardLabel="prosegui" />
    </WhiteBackground>
  )
}

function Step2({ stepForward, stepBack }: StepperStepComponentProps) {
  const addDelegateForm = () => {}

  return (
    <React.Fragment>
      <WhiteBackground>
        <Row>
          <h3 className="mb-4">Dati del rappresentante legale*</h3>

          <FloatingLabel controlId="adminName" label="Nome" className="mb-3">
            <Form.Control type="text" placeholder="Mario" />
          </FloatingLabel>

          <FloatingLabel controlId="adminSurname" label="Cognome" className="mb-3">
            <Form.Control type="text" placeholder="Rossi" />
          </FloatingLabel>

          <FloatingLabel controlId="adminCF" label="Codice Fiscale" className="mb-3">
            <Form.Control type="text" placeholder="RSSMR" />
          </FloatingLabel>

          <FloatingLabel controlId="adminEmail" label="Email" className="mb-3">
            <Form.Control type="email" placeholder="mario.rossi@example.com" />
          </FloatingLabel>
        </Row>
      </WhiteBackground>
      <WhiteBackground>
        <Row className="mb-5 pb-5">
          <h3>Dati dei delegati</h3>
          <p>L'aggiunta di delegati è opzionale</p>

          <Button variant="primary" onClick={addDelegateForm}>
            aggiungi delegato
          </Button>
        </Row>
        <ActionSteps
          backAction={stepBack}
          backLabel="indietro"
          forwardAction={stepForward}
          forwardLabel="prosegui"
        />
      </WhiteBackground>
    </React.Fragment>
  )
}

function Step3({ stepForward, stepBack }: StepperStepComponentProps) {
  return (
    <React.Fragment>
      <Row>step 3</Row>
      <ActionSteps
        backAction={stepBack}
        backLabel="indietro"
        forwardAction={stepForward}
        forwardLabel="invia"
      />
    </React.Fragment>
  )
}

type ActionStepsProps = {
  forwardAction?: any
  backAction?: any
  forwardLabel?: string
  backLabel?: string
}

function ActionSteps({ forwardAction, backAction, forwardLabel, backLabel }: ActionStepsProps) {
  return (
    <Row>
      {backAction && (
        <Button variant="secondary" onClick={backAction}>
          {backLabel}
        </Button>
      )}
      {forwardAction && (
        <Button variant="primary" onClick={forwardAction}>
          {forwardLabel}
        </Button>
      )}
    </Row>
  )
}

function OnboardingComponent() {
  const [activeStep, setActiveStep] = useState(0)

  const stepForward = () => {
    setActiveStep(activeStep + 1)
  }

  const stepBack = () => {
    setActiveStep(activeStep - 1)
  }

  const submit = () => {
    console.log('submitting')
  }

  const steps: StepperStep[] = [
    { label: "Seleziona l'ente", Component: () => Step1({ stepForward }) },
    { label: 'Inserisci i dati', Component: () => Step2({ stepForward, stepBack }) },
    { label: "Verifica l'accordo", Component: () => Step3({ stepForward: submit, stepBack }) },
  ]

  const Component = steps[activeStep].Component

  return (
    <React.Fragment>
      <WhiteBackground noVerticalMargin={true}>
        <Stepper steps={steps} activeIndex={activeStep} />
      </WhiteBackground>
      <Component />
    </React.Fragment>
  )
}

export const Onboarding = withLogin(OnboardingComponent)

import React, { useContext, useState } from 'react'
import { IPAParty, StepperStep, StepperStepComponentProps } from '../../types'
import { Stepper } from '../components/Stepper'
import { WhiteBackground } from '../components/WhiteBackground'
import { withLogin } from '../components/withLogin'
import { UserContext } from '../lib/context'
import { Row, Button, Form, FloatingLabel } from 'react-bootstrap'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { fetchWithLogs } from '../lib/api-utils'
import cryptoRandomString from 'crypto-random-string'

type AutocompleteProps = {
  selected: IPAParty[]
  setSelected: React.Dispatch<React.SetStateAction<IPAParty[]>>
}

function Autocomplete({ selected, setSelected }: AutocompleteProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<IPAParty[]>([])

  const handleSearch = async (query: string) => {
    setIsLoading(true)

    const parties = await fetchWithLogs('ONBOARDING_GET_SEARCH_PARTIES', {
      method: 'GET',
      params: { limit: 100, page: 1, search: query },
    })

    setOptions(parties?.data.items)
    setIsLoading(false)
  }

  const filterBy = () => true

  return (
    <AsyncTypeahead
      filterBy={filterBy}
      id="async-example"
      isLoading={isLoading}
      labelKey="description"
      minLength={3}
      onSearch={handleSearch}
      onChange={setSelected}
      selected={selected}
      options={options}
      placeholder="Cerca ente nel catalogo IPA"
      renderMenuItemChildren={(option, props) => (
        <React.Fragment>
          <span>{option.description}</span>
        </React.Fragment>
      )}
    />
  )
}

function Step1({ stepForward, setFormData, setLegalEmail }: StepperStepComponentProps) {
  const { user } = useContext(UserContext)
  const [selected, setSelected] = useState<IPAParty[]>([])

  const onForwardAction = () => {
    const { digitalAddress, id } = selected[0]
    setLegalEmail!(digitalAddress)
    setFormData!({ institutionId: id })
    stepForward!()
  }

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
      <Row className="my-4">
        <Autocomplete selected={selected} setSelected={setSelected} />
      </Row>

      <ActionSteps
        forward={{ action: onForwardAction, label: 'prosegui', disabled: selected.length === 0 }}
      />
    </WhiteBackground>
  )
}

type PersonFormProps = {
  prefix: string
}

function PersonForm({ prefix }: PersonFormProps) {
  return (
    <React.Fragment>
      <FloatingLabel controlId={`${prefix}-name`} label="Nome" className="mb-3">
        <Form.Control type="text" placeholder="Mario" />
      </FloatingLabel>

      <FloatingLabel controlId={`${prefix}-surname`} label="Cognome" className="mb-3">
        <Form.Control type="text" placeholder="Rossi" />
      </FloatingLabel>

      <FloatingLabel controlId={`${prefix}-cf`} label="Codice Fiscale" className="mb-3">
        <Form.Control type="text" placeholder="RSSMR" />
      </FloatingLabel>

      <FloatingLabel controlId={`${prefix}-email`} label="Email" className="mb-3">
        <Form.Control type="email" placeholder="mario.rossi@example.com" />
      </FloatingLabel>
    </React.Fragment>
  )
}

function Step2({ stepForward, stepBack }: StepperStepComponentProps) {
  const [delegateFormIds, setDelegateFormIds] = useState<string[]>([])
  const addDelegateForm = () => {
    setDelegateFormIds([...delegateFormIds, cryptoRandomString({ length: 8 })])
  }
  const buildRemoveDelegateForm = (idToRemove: string) => (e: React.SyntheticEvent) => {
    const filteredDelegateFormIds = delegateFormIds.filter((id) => id !== idToRemove)
    setDelegateFormIds(filteredDelegateFormIds)
  }

  return (
    <React.Fragment>
      <WhiteBackground>
        <Row>
          <h3 className="mb-4">Dati del rappresentante legale*</h3>
          <PersonForm prefix="admin" />
        </Row>
      </WhiteBackground>
      <WhiteBackground>
        <Row className="mb-5 pb-5">
          <h3>Dati dei delegati</h3>
          <p>L'aggiunta di delegati è opzionale</p>
        </Row>

        {delegateFormIds.map((id, i) => {
          return (
            <Row className="my-5" key={id}>
              <PersonForm prefix={`delegate-${id}`} />
              <Button variant="primary" onClick={buildRemoveDelegateForm(id)}>
                rimuovi questo delegato
              </Button>
            </Row>
          )
        })}

        <Row className="mb-5">
          <Button variant="primary" onClick={addDelegateForm}>
            aggiungi delegato
          </Button>
        </Row>
        <ActionSteps
          back={{ action: stepBack, label: 'indietro', disabled: false }}
          forward={{ action: stepForward, label: 'prosegui', disabled: false }}
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
        back={{ action: stepBack, label: 'indietro', disabled: false }}
        forward={{ action: stepForward, label: 'invia', disabled: false }}
      />
    </React.Fragment>
  )
}

type ActionStep = {
  action?: () => void
  label?: string
  disabled?: boolean
}

type ActionStepsProps = {
  forward?: ActionStep
  back?: ActionStep
}

function ActionSteps({ forward, back }: ActionStepsProps) {
  return (
    <Row>
      {back && (
        <Button variant="secondary" onClick={back.action} disabled={back.disabled}>
          {back.label}
        </Button>
      )}
      {forward && (
        <Button variant="primary" onClick={forward.action} disabled={forward.disabled}>
          {forward.label}
        </Button>
      )}
    </Row>
  )
}

function OnboardingComponent() {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [legalEmail, setLegalEmail] = useState()

  console.log({ formData, legalEmail })

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
    {
      label: "Seleziona l'ente",
      Component: () => Step1({ stepForward, setFormData, setLegalEmail }),
    },
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

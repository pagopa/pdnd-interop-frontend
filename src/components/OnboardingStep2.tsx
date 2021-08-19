import React, { useState } from 'react'
import { FloatingLabel, Form, Row, Button, Container } from 'react-bootstrap'
import { OnboardingStepActions } from './OnboardingStepActions'
import { WhiteBackground } from './WhiteBackground'
import cryptoRandomString from 'crypto-random-string'
import { StepperStepComponentProps, UserRole } from '../../types'
import { objectIsEmpty } from '../lib/object-utils'

type PersonFormProps = {
  prefix: string
  role: UserRole
  people: UsersObject
  setPeople: React.Dispatch<React.SetStateAction<UsersObject>>
}

// Could be an ES6 set but it's too bothersome for now
type UsersObject = { [key: string]: any }

function PersonForm({ prefix, role, people, setPeople }: PersonFormProps) {
  const buildSetPerson = (key: string) => (e: any) => {
    setPeople({ ...people, [prefix]: { [key]: e.target.value, role } })
  }

  return (
    <React.Fragment>
      <FloatingLabel controlId={`${prefix}-name`} label="Nome" className="mb-3">
        <Form.Control type="text" placeholder="Mario" onChange={buildSetPerson('name')} />
      </FloatingLabel>

      <FloatingLabel controlId={`${prefix}-surname`} label="Cognome" className="mb-3">
        <Form.Control type="text" placeholder="Rossi" onChange={buildSetPerson('surname')} />
      </FloatingLabel>

      <FloatingLabel controlId={`${prefix}-tax-code`} label="Codice Fiscale" className="mb-3">
        <Form.Control type="text" placeholder="RSSMR" onChange={buildSetPerson('taxCode')} />
      </FloatingLabel>

      <FloatingLabel controlId={`${prefix}-email`} label="Email" className="mb-3">
        <Form.Control
          type="email"
          placeholder="mario.rossi@example.com"
          onChange={buildSetPerson('email')}
        />
      </FloatingLabel>
    </React.Fragment>
  )
}

export function OnboardingStep2({ forward, back, maxWidth }: StepperStepComponentProps) {
  const [delegateFormIds, setDelegateFormIds] = useState<string[]>([])
  const [people, setPeople] = useState<UsersObject>({})

  const addDelegateForm = () => {
    setDelegateFormIds([...delegateFormIds, cryptoRandomString({ length: 8 })])
  }
  const buildRemoveDelegateForm = (idToRemove: string) => (e: React.SyntheticEvent) => {
    const filteredDelegateFormIds = delegateFormIds.filter((id) => id !== idToRemove)
    setDelegateFormIds(filteredDelegateFormIds)
  }

  const onForwardAction = () => {
    forward!({ users: Object.values(people) })
  }

  return (
    <React.Fragment>
      <WhiteBackground>
        <Container className="container-align-left" style={{ maxWidth }}>
          <Row>
            <h3 className="mb-4">Dati del rappresentante legale*</h3>
            <PersonForm prefix="admin" role="manager" people={people} setPeople={setPeople} />
          </Row>
        </Container>
      </WhiteBackground>
      <WhiteBackground>
        <Container className="container-align-left" style={{ maxWidth }}>
          <Row className="mb-3">
            <h3>Dati dei delegati</h3>
            <p>L'aggiunta di delegati è opzionale</p>
          </Row>

          {delegateFormIds.map((id) => {
            return (
              <div className="my-5" key={id}>
                <PersonForm
                  prefix={`delegate-${id}`}
                  role="delegate"
                  people={people}
                  setPeople={setPeople}
                />
                <Button variant="primary" onClick={buildRemoveDelegateForm(id)}>
                  rimuovi questo delegato
                </Button>
              </div>
            )
          })}

          <div className="mb-5">
            <Button variant="primary" onClick={addDelegateForm}>
              aggiungi nuovo delegato
            </Button>
          </div>
          <OnboardingStepActions
            back={{ action: back, label: 'indietro', disabled: false }}
            forward={{
              action: onForwardAction,
              label: 'prosegui',
              disabled: objectIsEmpty(people),
            }}
          />
        </Container>
      </WhiteBackground>
    </React.Fragment>
  )
}

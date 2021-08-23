import React, { useState } from 'react'
import { Row, Button, Container } from 'react-bootstrap'
import { OnboardingStepActions } from './OnboardingStepActions'
import { WhiteBackground } from './WhiteBackground'
import cryptoRandomString from 'crypto-random-string'
import { StepperStepComponentProps, StyledInputTextType, UserRole } from '../../types'
import { objectIsEmpty } from '../lib/object-utils'
import { StyledInputText } from './StyledInputText'

type PersonFormProps = {
  prefix: string
  role: UserRole
  people: UsersObject
  setPeople: React.Dispatch<React.SetStateAction<UsersObject>>
}

// Could be an ES6 Set but it's too bothersome for now
type UsersObject = { [key: string]: any }

function PersonForm({ prefix, role, people, setPeople }: PersonFormProps) {
  const buildSetPerson = (key: string) => (e: any) => {
    setPeople({ ...people, [prefix]: { ...people[prefix], [key]: e.target.value, role } })
  }

  const fields = [
    {
      id: 'name',
      label: 'Nome',
      placeholder: 'Mario',
    },
    {
      id: 'surname',
      label: 'Cognome',
      placeholder: 'Rossi',
    },
    {
      id: 'taxCode',
      label: 'Codice Fiscale',
      placeholder: 'RSSMR',
    },
    {
      id: 'email',
      label: 'Email',
      placeholder: 'mario.rossi@example.com',
      type: 'email',
    },
  ]

  return (
    <React.Fragment>
      {fields.map(({ id, label, placeholder, type = 'text' }, i) => (
        <React.Fragment key={i}>
          <StyledInputText
            id={`${prefix}-${id}`}
            label={label}
            type={type as StyledInputTextType}
            placeholder={placeholder}
            // Below, ugly hack to prevent React from complaining.
            // Controlled components values cannot start as 'undefined'
            value={people[prefix] && people[prefix][id] ? people[prefix][id] : ''}
            onChange={buildSetPerson(id)}
          />
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}

export function OnboardingStep2({ forward, back }: StepperStepComponentProps) {
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
        <Container className="container-align-left form-max-width">
          <Row>
            <h3 className="mb-4">Dati del rappresentante legale*</h3>
            <PersonForm prefix="admin" role="manager" people={people} setPeople={setPeople} />
          </Row>
        </Container>
      </WhiteBackground>
      <WhiteBackground>
        <Container className="container-align-left form-max-width">
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

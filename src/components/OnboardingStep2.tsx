import React, { useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { OnboardingStepActions } from './OnboardingStepActions'
import { WhiteBackground } from './WhiteBackground'
import cryptoRandomString from 'crypto-random-string'
import { StepperStepComponentProps, UserOnCreate } from '../../types'
import { objectIsEmpty } from '../lib/object-utils'
import { StyledIntro } from './Shared/StyledIntro'
import { PlatformUserForm } from './PlatformUserForm'

// Could be an ES6 Set but it's too bothersome for now
export type UsersObject = { [key: string]: UserOnCreate }

export function OnboardingStep2({ forward, back }: StepperStepComponentProps) {
  const [delegateFormIds, setDelegateFormIds] = useState<string[]>([])
  const [people, setPeople] = useState<UsersObject>({})

  const addDelegateForm = () => {
    setDelegateFormIds([...delegateFormIds, cryptoRandomString({ length: 8 })])
  }
  const buildRemoveDelegateForm = (idToRemove: string) => (_: React.SyntheticEvent) => {
    const filteredDelegateFormIds = delegateFormIds.filter((id) => id !== idToRemove)
    setDelegateFormIds(filteredDelegateFormIds)
  }

  const onForwardAction = () => {
    forward!(people)
  }

  return (
    <React.Fragment>
      <WhiteBackground>
        <Container className="container-align-left form-max-width">
          <StyledIntro>{{ title: 'Dati del rappresentante legale' }}</StyledIntro>
          <PlatformUserForm
            prefix="admin"
            role="Manager"
            platformRole="admin"
            people={people}
            setPeople={setPeople}
          />
        </Container>
      </WhiteBackground>
      <WhiteBackground>
        <Container className="container-align-left form-max-width">
          <StyledIntro>
            {{ title: 'Dati dei delegati', description: "L'aggiunta di delegati è opzionale" }}
          </StyledIntro>

          {delegateFormIds.map((id) => {
            return (
              <div className="my-5" key={id}>
                <PlatformUserForm
                  prefix={`delegate-${id}`}
                  role="Delegate"
                  platformRole="admin"
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

import React, { useState } from 'react'
import { OnboardingStepActions } from './OnboardingStepActions'
import cryptoRandomString from 'crypto-random-string'
import { StepperStepComponentProps, UserOnCreate } from '../../types'
import { objectIsEmpty } from '../lib/object-utils'
import { StyledIntro } from './Shared/StyledIntro'
import { PlatformUserForm } from './PlatformUserForm'
import { StyledButton } from './Shared/StyledButton'

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
      <StyledIntro>{{ title: 'Dati del rappresentante legale' }}</StyledIntro>
      <PlatformUserForm
        prefix="admin"
        role="Manager"
        platformRole="admin"
        people={people}
        setPeople={setPeople}
      />

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
            <StyledButton variant="contained" onClick={buildRemoveDelegateForm(id)}>
              rimuovi questo delegato
            </StyledButton>
          </div>
        )
      })}

      <div className="mb-5">
        <StyledButton variant="contained" onClick={addDelegateForm}>
          aggiungi nuovo delegato
        </StyledButton>
      </div>
      <OnboardingStepActions
        back={{ action: back, label: 'indietro', disabled: false }}
        forward={{
          action: onForwardAction,
          label: 'prosegui',
          disabled: objectIsEmpty(people),
        }}
      />
    </React.Fragment>
  )
}

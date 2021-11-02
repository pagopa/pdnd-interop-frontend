import React, { useState } from 'react'
import { OnboardingStepActions } from './OnboardingStepActions'
import cryptoRandomString from 'crypto-random-string'
import { StepperStepComponentProps, UserOnCreate } from '../../types'
import { objectIsEmpty } from '../lib/object-utils'
import { StyledIntro } from './Shared/StyledIntro'
import { PlatformUserForm } from './Shared/PlatformUserForm'
import { StyledButton } from './Shared/StyledButton'
import { Box } from '@mui/system'

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
          <Box sx={{ mb: '2rem' }} key={id}>
            <PlatformUserForm
              prefix={`delegate-${id}`}
              role="Delegate"
              platformRole="admin"
              people={people}
              setPeople={setPeople}
            />
            <StyledButton variant="contained" onClick={buildRemoveDelegateForm(id)}>
              Rimuovi questo delegato
            </StyledButton>
          </Box>
        )
      })}

      <Box sx={{ mb: '2rem' }}>
        <StyledButton variant="contained" onClick={addDelegateForm}>
          Aggiungi nuovo delegato
        </StyledButton>
      </Box>
      <OnboardingStepActions
        back={{ action: back, label: 'Indietro', disabled: false }}
        forward={{
          action: onForwardAction,
          label: 'Prosegui',
          disabled: objectIsEmpty(people),
        }}
      />
    </React.Fragment>
  )
}

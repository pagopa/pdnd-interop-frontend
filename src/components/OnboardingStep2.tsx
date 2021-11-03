import React, { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import isEmpty from 'lodash/isEmpty'
import { StepperStepComponentProps, UserOnCreate } from '../../types'
import { objectIsEmpty } from '../lib/object-utils'
import { OnboardingStepActions } from './OnboardingStepActions'
import { StyledIntro } from './Shared/StyledIntro'
import { PlatformUserForm } from './Shared/PlatformUserForm'

export function OnboardingStep2({ forward, back, data }: StepperStepComponentProps) {
  const [people, setPeople] = useState<Record<string, UserOnCreate>>({})

  const onForwardAction = () => {
    forward!(people)
  }

  useEffect(() => {
    if (!isEmpty(data.partyPeople)) {
      setPeople(data.partyPeople)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <StyledIntro>{{ title: 'Indica il Legale Rappresentante' }}</StyledIntro>
      <Box sx={{ textAlign: 'left', boxShadow: 7, px: '1rem', py: '0.25rem' }}>
        <PlatformUserForm
          prefix="admin"
          role="Manager"
          platformRole="admin"
          people={people}
          setPeople={setPeople}
        />
      </Box>

      <OnboardingStepActions
        back={{ action: back, label: 'Indietro', disabled: false }}
        forward={{
          action: onForwardAction,
          label: 'Conferma',
          disabled: objectIsEmpty(people),
        }}
      />
    </React.Fragment>
  )
}

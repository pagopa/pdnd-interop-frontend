import React, { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import cryptoRandomString from 'crypto-random-string'
import { CloseOutlined as CloseOutlinedIcon } from '@mui/icons-material'
import { StepperStepComponentProps, UserOnCreate } from '../../types'
import { objectIsEmpty } from '../lib/object-utils'
import { StyledIntro } from './Shared/StyledIntro'
import { PlatformUserForm } from './Shared/PlatformUserForm'
import { StyledButton } from './Shared/StyledButton'
import { StyledLink } from './Shared/StyledLink'
import { OnboardingStepActions } from './OnboardingStepActions'

export function OnboardingStep3({ forward, back }: StepperStepComponentProps) {
  const [delegateFormIds, setDelegateFormIds] = useState<string[]>([])
  const [people, setPeople] = useState<Record<string, UserOnCreate>>({})

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

  useEffect(() => {
    addDelegateForm()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <StyledIntro>{{ title: 'Indica i Delegati' }}</StyledIntro>

      {delegateFormIds.map((id, i) => {
        return (
          <Box sx={{ textAlign: 'left', boxShadow: 7, mb: '2rem' }}>
            {i > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <StyledButton onClick={buildRemoveDelegateForm(id)}>
                  <CloseOutlinedIcon />
                </StyledButton>
              </Box>
            )}

            <Box sx={{ px: '1rem', py: '0.25rem' }}>
              <PlatformUserForm
                prefix={`delegate-${id}`}
                role="Delegate"
                platformRole="admin"
                people={people}
                setPeople={setPeople}
              />
            </Box>
          </Box>
        )
      })}

      <Box sx={{ mb: '2rem' }}>
        <StyledLink component="button" onClick={addDelegateForm}>
          <Typography>Aggiungi nuovo delegato</Typography>
        </StyledLink>
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

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import cryptoRandomString from 'crypto-random-string'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import { CloseOutlined as CloseOutlinedIcon } from '@mui/icons-material'
import { StepperStepComponentProps, UserOnCreate } from '../../types'
import { useForceUpdate } from '../hooks/useForceUpdate'
import { StyledIntro } from './Shared/StyledIntro'
import { StyledButton } from './Shared/StyledButton'
import { StyledLink } from './Shared/StyledLink'
import { OnboardingStepActions } from './OnboardingStepActions'
import { StyledForm } from './Shared/StyledForm'
import { PlatformUserControlledForm } from './Shared/PlatformUserControlledForm'

export function OnboardingStep3({ forward, back }: StepperStepComponentProps) {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const forceUpdate = useForceUpdate()

  const addDelegateForm = (e?: any) => {
    if (e) e.preventDefault()
    setValue(cryptoRandomString({ length: 8 }), {}, { shouldValidate: false })
    forceUpdate() // Without this, the component doesn't rerender and doesn't show the new field
  }

  const buildRemoveDelegateForm = (idToRemove: string) => (_: React.SyntheticEvent) => {
    const peopleObject = getValues()
    delete peopleObject[idToRemove]
    reset(peopleObject)
  }

  const onForwardAction = (delegates: Record<string, UserOnCreate>) => {
    const delegatesWithRole = Object.keys(delegates).reduce(
      (acc, nextKey) => ({
        ...acc,
        [nextKey]: { ...delegates[nextKey], role: 'Delegate', platformRole: 'admin' },
      }),
      {}
    )

    forward!(delegatesWithRole)
  }

  useEffect(() => {
    addDelegateForm()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <StyledIntro>
        {{ title: 'Indica i Delegati', description: 'Inserisci almeno un Delegato' }}
      </StyledIntro>

      <StyledForm onSubmit={handleSubmit(onForwardAction)}>
        {/* TEMP REFACTOR: getValues shouldn't be used in render. Keeping it for now */}
        {Object.keys(getValues()).map((id, i) => {
          return (
            <Box key={i} sx={{ textAlign: 'left', boxShadow: 7, mb: 4 }}>
              {i > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <StyledButton onClick={buildRemoveDelegateForm(id)}>
                    <CloseOutlinedIcon />
                  </StyledButton>
                </Box>
              )}

              <Box sx={{ px: 2, py: 1 }}>
                <PlatformUserControlledForm prefix={id} control={control} errors={errors} />
              </Box>
            </Box>
          )
        })}

        <Box sx={{ mb: 4 }}>
          <StyledLink component="button" onClick={addDelegateForm}>
            <Typography>Aggiungi nuovo delegato</Typography>
          </StyledLink>
        </Box>

        <OnboardingStepActions
          back={{ action: back, label: 'Indietro' }}
          forward={{ label: 'Conferma' }}
        />
      </StyledForm>
    </React.Fragment>
  )
}

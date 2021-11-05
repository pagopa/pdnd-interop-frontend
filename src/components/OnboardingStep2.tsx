import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Box } from '@mui/system'
import { StepperStepComponentProps, User, UserOnCreate } from '../../types'
import { OnboardingStepActions } from './OnboardingStepActions'
import { StyledIntro } from './Shared/StyledIntro'
import { PlatformUserControlledForm } from './Shared/PlatformUserControlledForm'
import { StyledForm } from './Shared/StyledForm'

export function OnboardingStep2({ forward, back, data }: StepperStepComponentProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues: data.partyPeople })

  const onForwardAction = ({ admin }: Record<string, UserOnCreate>) => {
    forward!({ admin: { ...admin, role: 'Manager', platformRole: 'admin' } as User })
  }

  useEffect(() => {}, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <StyledIntro>{{ title: 'Indica il Legale Rappresentante' }}</StyledIntro>

      <StyledForm onSubmit={handleSubmit(onForwardAction)}>
        <Box sx={{ textAlign: 'left', boxShadow: 7, px: 2, py: 1 }}>
          <PlatformUserControlledForm prefix="admin" control={control} errors={errors} />
        </Box>

        <OnboardingStepActions
          back={{ action: back, label: 'Indietro' }}
          forward={{ label: 'Conferma' }}
        />
      </StyledForm>
    </React.Fragment>
  )
}

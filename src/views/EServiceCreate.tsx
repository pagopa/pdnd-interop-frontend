import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { Box } from '@mui/system'
import { StepperStep } from '../../types'
import { EServiceCreateStep1General } from '../components/EServiceCreateStep1General'
import { EServiceCreateStep2Version } from '../components/EServiceCreateStep2Version'
import { EServiceCreateStep3Documents } from '../components/EServiceCreateStep3Documents'
import { StyledStepper } from '../components/Shared/StyledStepper'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useActiveStep } from '../hooks/useActiveStep'
import { useEserviceCreateFetch } from '../hooks/useEserviceCreateFetch'
import { buildDynamicPath } from '../lib/router-utils'
import { useRoute } from '../hooks/useRoute'
import { Grid } from '@mui/material'

const STEPS: Array<StepperStep> = [
  { label: 'Generale', component: EServiceCreateStep1General },
  { label: 'Versione', component: EServiceCreateStep2Version },
  { label: 'Documentazione', component: EServiceCreateStep3Documents },
]

export function EServiceCreate() {
  const { routes } = useRoute()
  const history = useHistory()
  const { back, forward, activeStep } = useActiveStep()
  const { data, eserviceId, descriptorId } = useEserviceCreateFetch()
  const stepProps = { forward, back }
  const { component: Step } = STEPS[activeStep]

  useEffect(() => {
    // If this E-Service is not in draft, you cannot edit it
    if (data && data.activeDescriptor && data.activeDescriptor.state !== 'DRAFT') {
      history.replace(
        buildDynamicPath(routes.PROVIDE_ESERVICE_MANAGE.PATH, {
          eserviceId,
          descriptorId,
        })
      )
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  const intro = data
    ? { title: data.name, description: data.description }
    : { title: 'Crea E-Service' }

  return (
    <Box sx={{ maxWidth: 860 }}>
      <StyledIntro>{intro}</StyledIntro>
      <StyledStepper steps={STEPS} activeIndex={activeStep} />
      <Grid container>
        <Grid item xs={8}>
          <Step {...stepProps} />
        </Grid>
      </Grid>
    </Box>
  )
}

import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
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
import { useTranslation } from 'react-i18next'

export function EServiceCreate() {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { routes } = useRoute()
  const history = useHistory()
  const { back, forward, activeStep } = useActiveStep()
  const { data, eserviceId, descriptorId } = useEserviceCreateFetch()
  const stepProps = { forward, back }
  const STEPS: Array<StepperStep> = [
    { label: t('stepper.step1Label'), component: EServiceCreateStep1General },
    { label: t('stepper.step2Label'), component: EServiceCreateStep2Version },
    { label: t('stepper.step3Label'), component: EServiceCreateStep3Documents },
  ]
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
    : { title: t('emptyTitle') }

  return (
    <React.Fragment>
      <StyledIntro>{intro}</StyledIntro>
      <Grid container>
        <Grid item xs={8}>
          <StyledStepper steps={STEPS} activeIndex={activeStep} />
          <Step {...stepProps} />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

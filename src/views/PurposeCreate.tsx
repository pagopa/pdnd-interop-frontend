import React, { useContext } from 'react'
import { Grid, Alert } from '@mui/material'
import { EServiceFlatReadType, StepperStep } from '../../types'
import { PurposeCreateStep1General } from '../components/PurposeCreateStep1General'
import { PurposeCreateStep2RiskAnalysis } from '../components/PurposeCreateStep2RiskAnalysis'
import { PurposeCreateStep3Clients } from '../components/PurposeCreateStep3Clients'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledStepper } from '../components/Shared/StyledStepper'
import { useActiveStep } from '../hooks/useActiveStep'
import { PartyContext } from '../lib/context'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useRoute } from '../hooks/useRoute'
import { StyledLink } from '../components/Shared/StyledLink'

const STEPS: Array<StepperStep> = [
  { label: 'Generale', component: PurposeCreateStep1General },
  { label: 'Analisi del rischio', component: PurposeCreateStep2RiskAnalysis },
  { label: 'Client', component: PurposeCreateStep3Clients },
]

export const PurposeCreate = () => {
  const { activeStep, forward, back } = useActiveStep()
  const { component: Step } = STEPS[activeStep]
  const stepProps = { forward, back }
  const { party } = useContext(PartyContext)
  const { routes } = useRoute()

  const { data: eserviceData } = useAsyncFetch<Array<EServiceFlatReadType>>({
    path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
    config: { params: { callerId: party?.id, consumerId: party?.id, agreementStates: 'ACTIVE' } },
  })

  return (
    <React.Fragment>
      <StyledIntro>{{ title: 'Crea finalità' }}</StyledIntro>
      {eserviceData && Boolean(eserviceData.length > 0) ? (
        <Grid container>
          <Grid item xs={8}>
            <StyledStepper steps={STEPS} activeIndex={activeStep} />
            <Step {...stepProps} />
          </Grid>
        </Grid>
      ) : (
        <Alert severity="info">
          Non si possono creare finalità perché non ci sono servizi associabili.{' '}
          <StyledLink to={routes.SUBSCRIBE_CATALOG_LIST.PATH}>Visita il catalogo</StyledLink> e
          iscriviti al tuo primo E-Service
        </Alert>
      )}
    </React.Fragment>
  )
}

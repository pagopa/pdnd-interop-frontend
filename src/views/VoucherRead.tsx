import React from 'react'
import { useLocation } from 'react-router-dom'
import { Grid } from '@mui/material'
import { Purpose, StepperStep, StepperStepComponentProps } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledStepper } from '../components/Shared/StyledStepper'
import { VoucherReadStep1 } from '../components/VoucherReadStep1'
import { VoucherReadStep2 } from '../components/VoucherReadStep2'
import { VoucherReadStep3 } from '../components/VoucherReadStep3'
import { useActiveStep } from '../hooks/useActiveStep'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { getBits } from '../lib/router-utils'

const STEPS: Array<StepperStep> = [
  { label: 'Generale', component: VoucherReadStep1 },
  { label: 'Analisi del rischio', component: VoucherReadStep2 },
  { label: 'Client', component: VoucherReadStep3 },
]

export type VoucherStepProps = StepperStepComponentProps & {
  purposeId: string
  clientId: string
  data?: Purpose
}

export const VoucherRead = () => {
  const location = useLocation()
  const bits = getBits(location)
  const purposeId = bits[bits.length - 1]
  const clientId = bits[bits.length - 3]

  const { data, isLoading /*, error */ } = useAsyncFetch<Purpose>({
    path: { endpoint: 'PURPOSE_GET_SINGLE', endpointParams: { purposeId } },
  })
  const { activeStep, forward, back } = useActiveStep()
  const { component: Step } = STEPS[activeStep]
  const stepProps: VoucherStepProps = { forward, back, data, purposeId, clientId }

  console.log('data', data)

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'Istruzioni stacco del voucher',
          description:
            'Di seguito le istruzioni per ottenere un Voucher spendibile presso l’Erogatore dell’E-Service',
        }}
      </StyledIntro>
      <Grid container>
        <Grid item xs={8}>
          <StyledStepper steps={STEPS} activeIndex={activeStep} />
          {!isLoading && <Step {...stepProps} />}
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

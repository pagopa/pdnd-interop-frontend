import React, { useEffect, useState } from 'react'
import { Grid, Paper } from '@mui/material'
import { ClientPurpose, Purpose, StepperStep, StepperStepComponentProps } from '../../types'
import { StyledStepper } from '../components/Shared/StyledStepper'
import { ClientVoucherReadStep1 } from './ClientVoucherReadStep1'
import { ClientVoucherReadStep2 } from './ClientVoucherReadStep2'
import { ClientVoucherReadStep3 } from './ClientVoucherReadStep3'
import { useActiveStep } from '../hooks/useActiveStep'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { AxiosResponse } from 'axios'
import { StyledInputControlledSelect } from '../components/Shared/StyledInputControlledSelect'

const STEPS: Array<StepperStep> = [
  { label: 'Client assertion', component: ClientVoucherReadStep1 },
  { label: 'Stacco access token', component: ClientVoucherReadStep2 },
  { label: 'Dettagli E-Service', component: ClientVoucherReadStep3 },
]

export type VoucherStepProps = StepperStepComponentProps & {
  purposeId: string
  clientId: string
  data?: Purpose
}

type ClientVoucherReadProps = {
  clientId: string
  purposes?: Array<ClientPurpose>
}

export const ClientVoucherRead = ({ clientId, purposes }: ClientVoucherReadProps) => {
  const { activeStep, forward, back } = useActiveStep()
  const { component: Step } = STEPS[activeStep]

  const [purpose, setPurpose] = useState()
  const [selectedPurposeId, setSelectedPurposeId] = useState(purposes ? purposes[0].purposeId : '')

  const onPurposeIdChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement
    setSelectedPurposeId(target.value)
  }

  useEffect(() => {
    async function asyncFetchPurpose() {
      const response = await fetchWithLogs({
        path: { endpoint: 'PURPOSE_GET_SINGLE', endpointParams: { purposeId: selectedPurposeId } },
      })

      if (!isFetchError(response)) {
        setPurpose((response as AxiosResponse).data)
      }
    }

    asyncFetchPurpose()
  }, [selectedPurposeId]) // eslint-disable-line react-hooks/exhaustive-deps

  const stepProps: VoucherStepProps = {
    forward,
    back,
    data: purpose,
    purposeId: selectedPurposeId,
    clientId,
  }

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={8}>
          {purposes && (
            <Paper sx={{ bgcolor: 'background.paper', px: 3, py: 1, mb: 2 }}>
              <StyledInputControlledSelect
                sx={{ my: 4 }}
                name="purpose"
                label="Scegli la finalità da utilizzare"
                value={selectedPurposeId}
                onChange={onPurposeIdChange}
                options={purposes.map((p) => ({
                  value: p.purposeId,
                  label: `${p.title} per ${p.agreement.eservice.name}`,
                }))}
                emptyLabel="Non ci sono finalità disponibili"
              />
            </Paper>
          )}

          <StyledStepper steps={STEPS} activeIndex={activeStep} />
          <Step {...stepProps} />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

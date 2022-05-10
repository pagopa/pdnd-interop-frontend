import React, { useEffect, useState } from 'react'
import { Alert, Grid, Paper } from '@mui/material'
import {
  ClientKind,
  ClientPurpose,
  PublicKeys,
  Purpose,
  StepperStep,
  StepperStepComponentProps,
} from '../../types'
import { StyledStepper } from '../components/Shared/StyledStepper'
import { VoucherReadStep1 } from './VoucherReadStep1'
import { VoucherReadStep2 } from './VoucherReadStep2'
import { VoucherReadStep3 } from './VoucherReadStep3'
import { useActiveStep } from '../hooks/useActiveStep'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { AxiosResponse } from 'axios'
import { StyledInputControlledSelect } from '../components/Shared/StyledInputControlledSelect'
import { StyledLink } from './Shared/StyledLink'
import { useRoute } from '../hooks/useRoute'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { LoadingWithMessage } from './Shared/LoadingWithMessage'
import { buildDynamicPath } from '../lib/router-utils'

const STEPS: Array<StepperStep> = [
  { label: 'Client assertion', component: VoucherReadStep1 },
  { label: 'Stacco access token', component: VoucherReadStep2 },
  { label: 'Dettagli E-Service', component: VoucherReadStep3 },
]

export type ClientVoucherStepProps = StepperStepComponentProps & {
  purposeId: string
  clientId: string
  clientKind: ClientKind
  keysData: PublicKeys
  data?: Purpose
}

export type InteropM2MVoucherStepProps = StepperStepComponentProps & {
  clientId: string
  clientKind: ClientKind
  keysData: PublicKeys
}

type VoucherReadProps = {
  clientId: string
  clientKind: ClientKind
  purposes?: Array<ClientPurpose>
}

type InteropVoucherReadProps = Omit<VoucherReadProps, 'purposes'>

const ClientVoucherRead = ({
  clientId,
  clientKind,
  purposes,
  keysData,
}: VoucherReadProps & { keysData: PublicKeys }) => {
  const { activeStep, forward, back } = useActiveStep()
  const { component: Step } = STEPS[activeStep]
  const { routes } = useRoute()

  const [purpose, setPurpose] = useState()
  const [selectedPurposeId, setSelectedPurposeId] = useState(
    purposes && Boolean(purposes.length > 0) ? purposes[0].purposeId : ''
  )

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

  const stepProps: ClientVoucherStepProps = {
    forward,
    back,
    data: purpose,
    purposeId: selectedPurposeId,
    clientId,
    clientKind,
    keysData,
  }

  return (
    <Grid container>
      <Grid item xs={8}>
        {purposes && Boolean(purposes.length > 0) ? (
          <React.Fragment>
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

            <StyledStepper steps={STEPS} activeIndex={activeStep} />
            <Step {...stepProps} />
          </React.Fragment>
        ) : (
          <Alert severity="info">
            Non ci sono finalità disponibili.{' '}
            <StyledLink to={routes.SUBSCRIBE_PURPOSE_CREATE.PATH}>
              Crea la tua prima finalità
            </StyledLink>
          </Alert>
        )}
      </Grid>
    </Grid>
  )
}

const InteropM2MVoucherRead = ({
  clientId,
  clientKind,
  keysData,
}: InteropVoucherReadProps & { keysData: PublicKeys }) => {
  const { activeStep, forward, back } = useActiveStep()
  const { component: Step } = STEPS[activeStep]
  const stepProps: InteropM2MVoucherStepProps = { forward, back, clientId, clientKind, keysData }

  return (
    <Grid container>
      <Grid item xs={8}>
        <StyledStepper steps={STEPS} activeIndex={activeStep} />
        <Step {...stepProps} />
      </Grid>
    </Grid>
  )
}

export const VoucherRead = ({ clientId, clientKind, purposes }: VoucherReadProps) => {
  const { routes } = useRoute()

  const {
    data: keysData,
    error,
    isLoading,
  } = useAsyncFetch<PublicKeys>({
    path: { endpoint: 'KEY_GET_LIST', endpointParams: { clientId } },
  })

  if (isLoading) {
    return <LoadingWithMessage label="Stiamo caricando le chiavi disponibili" />
  }

  if (error && error.response?.status !== 404) {
    return <div>non è stato possibile caricare le chiavi</div>
  }

  if (
    (error && error?.response?.status === 404) ||
    (keysData && Boolean(keysData.keys.length === 0))
  ) {
    return (
      <Alert severity="info">
        Non ci sono chiavi disponibili, non è possibile staccare un voucher. Vai alla{' '}
        <StyledLink
          to={buildDynamicPath(
            routes.SUBSCRIBE_CLIENT_EDIT.PATH,
            { clientId },
            { tab: 'publicKeys' }
          )}
        >
          tab delle chiavi pubbliche
        </StyledLink>{' '}
        per caricare la tua prima chiave
      </Alert>
    )
  }

  const props = { clientId, clientKind, keysData: keysData as PublicKeys }

  return clientKind === 'CONSUMER' ? (
    <ClientVoucherRead {...props} purposes={purposes} />
  ) : (
    <InteropM2MVoucherRead {...props} />
  )
}

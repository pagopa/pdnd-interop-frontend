import { ClientQueries } from '@/api/client'
import { PurposeQueries } from '@/api/purpose'
import { Stepper } from '@/components/shared/Stepper'
import { useActiveStep } from '@/hooks/useActiveStep'
import { useJwt } from '@/hooks/useJwt'
import { RouterLink } from '@/router'
import { Alert, Grid, Skeleton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'
import { useGetVoucherInstructionsSteps } from '../../hooks/useGetVoucherInstructionsSteps'
import { VoucherInstructionsStepProps } from '../../types/voucher-instructions.types'
import { ClientVoucherIntructionsPurposeSelect } from './ClientVoucherIntructionsPurposeSelect'

import { useSearchParams } from 'react-router-dom'

interface VoucherInstructionsProps {
  clientId: string
}

const InteropM2MVoucherInstructions: React.FC<VoucherInstructionsProps> = ({ clientId }) => {
  const { activeStep, forward, back } = useActiveStep()
  const steps = useGetVoucherInstructionsSteps()
  const { data: clientKeys = { keys: [] } } = ClientQueries.useGetKeyList(clientId)

  const { component: Step } = steps[activeStep]

  const stepProps: VoucherInstructionsStepProps = {
    forward,
    back,
    clientId,
    clientKeys,
  }

  return (
    <>
      <Stepper steps={steps} activeIndex={activeStep} />
      <Step {...stepProps} />
    </>
  )
}

const ClientVoucherInstructions: React.FC<VoucherInstructionsProps> = ({ clientId }) => {
  const { activeStep, forward, back } = useActiveStep()
  const steps = useGetVoucherInstructionsSteps()
  const { isAdmin } = useJwt()
  const { t } = useTranslation('voucher')
  const { data: clientKeys = { keys: [] } } = ClientQueries.useGetKeyList(clientId)
  const { data: client } = ClientQueries.useGetSingle(clientId)
  const purposes = client?.purposes

  const [selectedPurposeId, setSelectedPurposeId] = useSearchParams({
    purposeId: purposes && purposes.length > 0 ? purposes[0].purposeId : '',
  })

  // const [selectedPurposeId, setSelectedPurposeId] = React.useState(
  //   selectedPurpose.get('purposeId')
  //     ? (selectedPurpose.get('purposeId') as string)
  //     : purposes && purposes.length > 0
  //     ? purposes[0].purposeId
  //     : ''
  // )

  // in teoria funziona (se ho capito bene quello che deve fare) però è molto brutto!!!
  // VA MIGLIORATO

  // React.useEffect(() => {
  //   if (!selectedPurposeId.get('purposeId'))
  //     setSelectedPurposeId({
  //       purposeId: purposes && purposes.length > 0 ? purposes[0].purposeId : '',
  //     })
  // }, [purposes, selectedPurposeId, setSelectedPurposeId])

  const handlePurposeSelectOnChange = (purposeId: string) => {
    setSelectedPurposeId({ purposeId: purposeId })
  }

  const { data: purpose } = PurposeQueries.useGetSingle(
    selectedPurposeId.get('purposeId') as string,
    {
      suspense: false,
    }
  )

  const { component: Step } = steps[activeStep]

  if (!purposes || purposes.length === 0) {
    return (
      <Alert severity="info">
        {t('noPurposesLabel')}.
        {isAdmin && (
          <>
            {' '}
            <RouterLink to={'SUBSCRIBE_PURPOSE_CREATE'}>{t('createPurposeBtn')}</RouterLink>{' '}
            {t('or')} <RouterLink to={'SUBSCRIBE_PURPOSE_LIST'}>{t('choosePurposeBtn')}</RouterLink>
          </>
        )}
      </Alert>
    )
  }

  const stepProps: VoucherInstructionsStepProps = {
    forward,
    back,
    clientId,
    clientKeys,
    purpose,
    purposeId: selectedPurposeId.get('purposeId') as string,
  }

  return (
    <>
      <ClientVoucherIntructionsPurposeSelect
        purposes={purposes}
        selectedPurposeId={selectedPurposeId.get('purposeId') as string}
        onChange={handlePurposeSelectOnChange}
      />
      <Stepper steps={steps} activeIndex={activeStep} />
      <Step {...stepProps} />
    </>
  )
}

export const VoucherInstructions: React.FC<VoucherInstructionsProps> = ({ clientId }) => {
  const { t } = useTranslation('voucher')
  const { data: clientKeys } = ClientQueries.useGetKeyList(clientId)
  const clientKind = useClientKind()

  if (!clientKeys || (clientKeys && Boolean(clientKeys.keys.length === 0))) {
    return (
      <Alert severity="info">
        {t('uploadKey.message')}{' '}
        <RouterLink
          to={'SUBSCRIBE_CLIENT_EDIT'}
          params={{ clientId }}
          options={{ urlParams: { tab: 'publicKeys' } }}
        >
          {t('uploadKey.linkLabel')}
        </RouterLink>
      </Alert>
    )
  }

  return (
    <Grid container>
      <Grid item xs={8}>
        {clientKind === 'CONSUMER' && <ClientVoucherInstructions clientId={clientId} />}
        {clientKind === 'API' && <InteropM2MVoucherInstructions clientId={clientId} />}
      </Grid>
    </Grid>
  )
}

export const VoucherInstructionsSkeleton: React.FC = () => {
  return (
    <Grid container>
      <Grid item xs={8}>
        <Skeleton variant="rectangular" height={111} />
        <Skeleton sx={{ mt: 2 }} variant="rectangular" height={600} />
      </Grid>
    </Grid>
  )
}

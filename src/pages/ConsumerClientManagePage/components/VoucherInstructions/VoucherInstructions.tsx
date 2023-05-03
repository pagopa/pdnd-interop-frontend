import { ClientQueries } from '@/api/client'
import { PurposeQueries } from '@/api/purpose'
import { Stepper } from '@/components/shared/Stepper'
import { useActiveStep } from '@/hooks/useActiveStep'
import { useJwt } from '@/hooks/useJwt'
import { RouterLink } from '@/router'
import { Alert, Grid } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'
import type { VoucherInstructionsStepProps } from '../../types/voucher-instructions.types'
import { ClientVoucherIntructionsPurposeSelect } from './ClientVoucherIntructionsPurposeSelect'
import { useSearchParams } from 'react-router-dom'
import { ApiInfoSection, ApiInfoSectionSkeleton } from '@/components/shared/ApiInfoSection'
import { SectionContainerSkeleton } from '@/components/layout/containers'
import { VoucherInstructionsStep1 } from './VoucherInstructionsStep1'
import { VoucherInstructionsStep2 } from './VoucherInstructionsStep2'
import { VoucherInstructionsStep3 } from './VoucherInstructionsStep3'

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
    <Grid container>
      <Grid item xs={8}>
        <Stepper steps={steps} activeIndex={activeStep} />
        <Step {...stepProps} />
      </Grid>
    </Grid>
  )
}

const ClientVoucherInstructions: React.FC<VoucherInstructionsProps> = ({ clientId }) => {
  const { activeStep, forward, back } = useActiveStep()
  const steps = useGetVoucherInstructionsSteps()
  const { isAdmin } = useJwt()
  const { t } = useTranslation('voucher')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'idLabels' })
  const { data: clientKeys = { keys: [] } } = ClientQueries.useGetKeyList(clientId)
  const { data: client } = ClientQueries.useGetSingle(clientId)
  const purposes = client?.purposes

  const [searchParams, setSearchParams] = useSearchParams({
    purposeId: purposes && purposes.length > 0 ? purposes[0].purposeId : '',
  })

  const selectedPurposeId = searchParams.get('purposeId') ?? ''

  const handlePurposeSelectOnChange = (purposeId: string) => {
    setSearchParams({ ...Object.fromEntries(searchParams), purposeId: purposeId })
  }

  const { data: purpose, isInitialLoading: isLoadingPurpose } = PurposeQueries.useGetSingle(
    selectedPurposeId,
    { suspense: false }
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
    purposeId: selectedPurposeId,
  }

  return (
    <>
      <Grid spacing={2} container>
        <Grid item xs={8}>
          <ClientVoucherIntructionsPurposeSelect
            purposes={purposes}
            selectedPurposeId={selectedPurposeId}
            onChange={handlePurposeSelectOnChange}
          />
          <Stepper steps={steps} activeIndex={activeStep} />
          <Step {...stepProps} />
        </Grid>
        <Grid item xs={4}>
          {purpose && (
            <ApiInfoSection
              ids={[
                { name: tCommon('eserviceId'), id: purpose.eservice.id },
                { name: tCommon('descriptorId'), id: purpose.eservice.descriptor.id },
                { name: tCommon('agreementId'), id: purpose.agreement.id },
                { name: tCommon('purposeId'), id: purpose.id },
                { name: tCommon('clientId'), id: clientId },
                { name: tCommon('providerId'), id: purpose.eservice.producer.id },
                { name: tCommon('consumerId'), id: purpose.consumer.id },
              ]}
            />
          )}
          {isLoadingPurpose && <ApiInfoSectionSkeleton height={604} />}
        </Grid>
      </Grid>
    </>
  )
}

export const VoucherInstructions: React.FC<VoucherInstructionsProps> = ({ clientId }) => {
  const { t } = useTranslation('voucher')
  const { data: clientKeys } = ClientQueries.useGetKeyList(clientId)
  const clientKind = useClientKind()

  if (!clientKeys || clientKeys.keys.length === 0) {
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
    <>
      {clientKind === 'CONSUMER' && <ClientVoucherInstructions clientId={clientId} />}
      {clientKind === 'API' && <InteropM2MVoucherInstructions clientId={clientId} />}
    </>
  )
}

export const VoucherInstructionsSkeleton: React.FC = () => {
  const clientKind = useClientKind()
  return (
    <Grid spacing={2} container>
      <Grid item xs={8}>
        <SectionContainerSkeleton height={111} />
        <SectionContainerSkeleton height={600} />
      </Grid>
      {clientKind === 'CONSUMER' && (
        <Grid item xs={4}>
          <ApiInfoSectionSkeleton height={604} />
        </Grid>
      )}
    </Grid>
  )
}

function useGetVoucherInstructionsSteps() {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()

  return [
    { label: t('step1.stepperLabel'), component: VoucherInstructionsStep1 },
    { label: t('step2.stepperLabel'), component: VoucherInstructionsStep2 },
    {
      label: t(`step3.${clientKind === 'CONSUMER' ? 'consumerStepperLabel' : 'apiStepperLabel'}`),
      component: VoucherInstructionsStep3,
    },
  ]
}

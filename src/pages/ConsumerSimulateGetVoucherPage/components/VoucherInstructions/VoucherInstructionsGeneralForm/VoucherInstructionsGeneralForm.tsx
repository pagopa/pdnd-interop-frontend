import React, { useEffect } from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Box, FormControl } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ApiIcon from '@mui/icons-material/Api'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { verifyVoucherGuideLink } from '@/config/constants'
import { VoucherInstructionsGeneralFormCurrentIdsDrawer } from './VoucherInstructionsGeneralFormCurrentIdsDrawer'
import { useDrawerState } from '@/hooks/useDrawerState'
import { StepActions } from '@/components/shared/StepActions'
import { useClientKind } from '@/hooks/useClientKind'
import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form'
import { RHFRadioGroup, RHFSelect } from '@/components/shared/react-hook-form-inputs'
import { useVoucherInstructionsContext } from '../VoucherInstructionsContext'
import { useSearchParams } from 'react-router-dom'
import { IconLink } from '@/components/shared/IconLink'
import { VoucherConsumerSimulationSection } from './VoucherConsumerSimulationSection'
import { VoucherProducerSimulationSection } from './VoucherProducerSimulationSection'

export interface VoucherInstructionsGeneralFormValues {
  clientId: string | null
  purposeId: string | null
  keyId: string | null
  voucherType: string | null
  interationType: string | null
  memberType: string | null
  asyncExchangeStep: string | null
  producerKeychainId: string | null
  eserviceId: string | null
  publicKeyId: string | null
}

export const VoucherInstructionsGeneralForm: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const { startStepper } = useVoucherInstructionsContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const formMethods = useForm<VoucherInstructionsGeneralFormValues>({
    defaultValues: {
      clientId: searchParams.get('clientId'),
      purposeId: searchParams.get('purposeId'),
      keyId: searchParams.get('keyId'),
      voucherType: searchParams.get('voucherType') || 'BEARER',
      interationType: searchParams.get('interationType') || 'SYNC',
      memberType: searchParams.get('memberType') || 'CONSUMER',
      producerKeychainId: searchParams.get('producerKeychainId'),
      eserviceId: searchParams.get('eserviceId'),
      publicKeyId: searchParams.get('publicKeyId'),
      asyncExchangeStep: searchParams.get('asyncExchangeStep'),
    },
  })

  const { watch, handleSubmit, reset, setValue } = formMethods

  const interationType = watch('interationType')
  const memberType = watch('memberType')
  const values = watch()

  /* Reset selects on client or keychain value change */
  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name === 'clientId') {
        setValue('purposeId', null)
        setValue('keyId', null)
        setSearchParams({})
      }
      if (name === 'producerKeychainId') {
        setValue('eserviceId', null)
        setValue('publicKeyId', null)
        setSearchParams({})
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setValue, setSearchParams])

  const canGoToNextStep = () => {
    if (clientKind === 'API') {
      return !!values.clientId && !!values.keyId
    }

    if (clientKind === 'CONSUMER') {
      if (interationType === 'SYNC') {
        return !!values.clientId && !!values.purposeId && !!values.keyId
      }

      if (interationType === 'ASYNC') {
        const common = !!values.asyncExchangeStep

        if (memberType === 'CONSUMER') {
          return common && !!values.clientId && !!values.purposeId && !!values.keyId
        }

        if (memberType === 'PRODUCER') {
          return (
            common && !!values.producerKeychainId && !!values.eserviceId && !!values.publicKeyId
          )
        }
      }
    }

    return false
  }

  const onSubmit: SubmitHandler<VoucherInstructionsGeneralFormValues> = (values) => {
    setSearchParams((prev) => {
      /* Voucher simulation general info */
      if (values.voucherType) prev.set('voucherType', values.voucherType)
      if (values.interationType) prev.set('interationType', values.interationType)
      if (values.asyncExchangeStep) prev.set('asyncExchangeStep', values.asyncExchangeStep)
      if (values.memberType) prev.set('memberType', values.memberType)
      /* Voucher simulation memberType consumer */
      if (values.clientId) prev.set('clientId', values.clientId)
      if (clientKind === 'CONSUMER' && values.purposeId) prev.set('purposeId', values.purposeId)
      if (values.keyId) prev.set('keyId', values.keyId)
      /* Voucher simulation memberType producer */
      if (values.producerKeychainId) prev.set('producerKeychainId', values.producerKeychainId)
      if (values.eserviceId) prev.set('eserviceId', values.eserviceId)
      if (values.publicKeyId) prev.set('publicKeyId', values.publicKeyId)
      return prev
    })
    startStepper(values)
  }

  const handleInterationTypeChanged = (interationType: string) => {
    setSearchParams({})
    reset({
      voucherType: values.voucherType,
      interationType,
      memberType: 'CONSUMER',
      asyncExchangeStep: null,
      clientId: null,
      purposeId: null,
      keyId: null,
      producerKeychainId: null,
      eserviceId: null,
      publicKeyId: null,
    })
  }

  const handleMemberTypeChanged = (memberType: string) => {
    setSearchParams({})
    if (memberType === 'CONSUMER') {
      reset({
        ...values,
        memberType,
        producerKeychainId: null,
        eserviceId: null,
        publicKeyId: null,
      })
    }

    if (memberType === 'PRODUCER') {
      reset({
        ...values,
        memberType: memberType,
        clientId: null,
        purposeId: null,
        keyId: null,
      })
    }
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <SectionContainer
          title={t('generalForm.technicalDetails.title')}
          description={t('generalForm.technicalDetails.description')}
        >
          <IconLink
            href={verifyVoucherGuideLink}
            target="_blank"
            startIcon={<OpenInNewIcon fontSize="small" />}
          >
            {t('generalForm.goToTechnicalDocsLabel')}
          </IconLink>
          <RHFRadioGroup
            name="voucherType"
            label={t('generalForm.voucherType.label')}
            required
            options={[
              { value: 'BEARER', label: t('generalForm.voucherType.options.bearer.label') },
              { value: 'DPOP', label: t('generalForm.voucherType.options.dpop.label') },
            ]}
          />
          {clientKind === 'CONSUMER' && (
            <RHFRadioGroup
              name="interationType"
              label={t('generalForm.interationType.label')}
              required
              options={[
                { value: 'SYNC', label: t('generalForm.interationType.options.sync') },
                { value: 'ASYNC', label: t('generalForm.interationType.options.async') },
              ]}
              onValueChange={(interationType) => handleInterationTypeChanged(interationType)}
            />
          )}
          {interationType === 'ASYNC' && (
            <RHFRadioGroup
              name="memberType"
              label={t('generalForm.memberType.label')}
              required
              options={[
                { value: 'CONSUMER', label: t('generalForm.memberType.options.consumer') },
                { value: 'PRODUCER', label: t('generalForm.memberType.options.producer') },
              ]}
              onValueChange={(memberType) => handleMemberTypeChanged(memberType)}
            />
          )}
        </SectionContainer>

        <SectionContainer
          title={t('generalForm.simulationSetup.title')}
          description={t('generalForm.simulationSetup.description')}
          bottomActions={[
            {
              startIcon: <ApiIcon fontSize="small" />,
              label: t('generalForm.showCurrentSelectionIds'),
              component: 'button',
              type: 'button',
              onClick: openDrawer,
            },
          ]}
        >
          {memberType === 'CONSUMER' && (
            <VoucherConsumerSimulationSection key={`consumer-${interationType}-${memberType}`} />
          )}

          {memberType === 'PRODUCER' && (
            <VoucherProducerSimulationSection key={`producer-${interationType}-${memberType}`} />
          )}

          {interationType === 'ASYNC' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <RHFSelect
                required
                rules={{ required: true }}
                name="asyncExchangeStep"
                label={t('generalForm.asyncExchangeStep.label')}
                options={[
                  {
                    label: t('generalForm.asyncExchangeStep.startInteraction'),
                    value: 'start_interaction',
                  },
                  { label: t('generalForm.asyncExchangeStep.getResource'), value: 'get_resource' },
                  { label: t('generalForm.asyncExchangeStep.confirmation'), value: 'confirmation' },
                ]}
              />
            </FormControl>
          )}
        </SectionContainer>
        <StepActions
          forward={{
            label: t('proceedBtn'),
            type: 'submit',
            disabled: !canGoToNextStep(),
            endIcon: <ArrowForwardIcon />,
          }}
        />
      </Box>
      <VoucherInstructionsGeneralFormCurrentIdsDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        clientId={values.clientId || ''}
        purposeId={values.purposeId || ''}
      />
    </FormProvider>
  )
}

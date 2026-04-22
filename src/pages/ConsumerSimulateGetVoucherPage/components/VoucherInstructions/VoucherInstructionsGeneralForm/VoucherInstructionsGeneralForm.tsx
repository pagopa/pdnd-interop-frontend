import React, { useEffect } from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Box, FormControl, Typography } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ApiIcon from '@mui/icons-material/Api'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { verifyVoucherGuideLink } from '@/config/constants'
import { VoucherInstructionsGeneralFormCurrentIdsDrawer } from './VoucherInstructionsGeneralFormCurrentIdsDrawer'
import { useDrawerState } from '@/hooks/useDrawerState'
import { StepActions } from '@/components/shared/StepActions'
import { useClientKind } from '@/hooks/useClientKind'
import { useForm, FormProvider } from 'react-hook-form'
import { RHFRadioGroup, RHFSelect } from '@/components/shared/react-hook-form-inputs'
import { useVoucherInstructionsContext } from '../VoucherInstructionsContext'
import { useSearchParams } from 'react-router-dom'
import { IconLink } from '@/components/shared/IconLink'
import { VoucherConsumerSimulationSection } from '../simulationSections/VoucherConsumerSimulationSection'
import { VoucherProducerSimulationSection } from '../simulationSections/VoucherProducerSimulationSection'

export const VOUCHER_TYPE = { BEARER: 'BEARER', DPOP: 'DPOP' } as const
export const INTERATION_TYPE = { SYNC: 'SYNC', ASYNC: 'ASYNC' } as const
export const MEMBER_TYPE = { CONSUMER: 'CONSUMER', PRODUCER: 'PRODUCER' } as const
export const ASYNC_EXCHANGE_STEP = {
  START_INTERACTION: 'start_interaction',
  GET_RESOURCE: 'get_resource',
  CONFIRMATION: 'confirmation',
} as const

export type VoucherType = (typeof VOUCHER_TYPE)[keyof typeof VOUCHER_TYPE]
export type InterationType = (typeof INTERATION_TYPE)[keyof typeof INTERATION_TYPE]
export type MemberType = (typeof MEMBER_TYPE)[keyof typeof MEMBER_TYPE]
export type AsyncExchangeStep = (typeof ASYNC_EXCHANGE_STEP)[keyof typeof ASYNC_EXCHANGE_STEP]

export interface VoucherInstructionsGeneralFormValues {
  clientId: string | null
  purposeId: string | null
  keyId: string | null
  voucherType: VoucherType
  interationType: InterationType
  memberType: MemberType
  asyncExchangeStep: AsyncExchangeStep | null
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
      voucherType: (searchParams.get('voucherType') as VoucherType) ?? VOUCHER_TYPE.BEARER,
      interationType:
        (searchParams.get('interationType') as InterationType) ?? INTERATION_TYPE.SYNC,
      memberType: (searchParams.get('memberType') as MemberType) ?? MEMBER_TYPE.CONSUMER,
      producerKeychainId: searchParams.get('producerKeychainId'),
      eserviceId: searchParams.get('eserviceId'),
      publicKeyId: searchParams.get('publicKeyId'),
      asyncExchangeStep: (searchParams.get('asyncExchangeStep') as AsyncExchangeStep) ?? null,
    },
  })

  const { watch, handleSubmit, setValue, reset } = formMethods
  const values = watch()

  const canGoToNextStep = () => {
    if (clientKind === 'API') {
      return !!values.clientId && !!values.keyId
    }

    if (clientKind === 'CONSUMER') {
      if (values.interationType === INTERATION_TYPE.SYNC) {
        return !!values.clientId && !!values.purposeId && !!values.keyId
      }

      if (values.interationType === INTERATION_TYPE.ASYNC) {
        const common = !!values.asyncExchangeStep

        if (values.memberType === MEMBER_TYPE.CONSUMER) {
          return common && !!values.clientId && !!values.purposeId && !!values.keyId
        }

        if (values.memberType === MEMBER_TYPE.PRODUCER) {
          return (
            common && !!values.producerKeychainId && !!values.eserviceId && !!values.publicKeyId
          )
        }
      }
    }

    return false
  }

  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name === 'clientId') {
        setValue('purposeId', null)
        setValue('keyId', null)
      }
      if (name === 'producerKeychainId') {
        setValue('eserviceId', null)
        setValue('publicKeyId', null)
      }
    })
    return () => subscription.unsubscribe()
  }, [setValue, watch])

  const handleInterationTypeChanged = (interationType: InterationType) => {
    reset({
      ...values,
      interationType,
      memberType: MEMBER_TYPE.CONSUMER,
      asyncExchangeStep: null,
      clientId: null,
      purposeId: null,
      keyId: null,
      producerKeychainId: null,
      eserviceId: null,
      publicKeyId: null,
    })
  }

  const handleMemberTypeChanged = (memberType: MemberType) => {
    if (memberType === MEMBER_TYPE.CONSUMER) {
      reset({
        ...values,
        memberType,
        producerKeychainId: null,
        eserviceId: null,
        publicKeyId: null,
        asyncExchangeStep: null,
      })
    }

    if (memberType === MEMBER_TYPE.PRODUCER) {
      reset({
        ...values,
        memberType,
        clientId: null,
        purposeId: null,
        keyId: null,
        asyncExchangeStep: null,
      })
    }
  }

  const onSubmit = (values: VoucherInstructionsGeneralFormValues) => {
    const params = new URLSearchParams()

    params.set('voucherType', values.voucherType)
    params.set('interationType', values.interationType)

    if (values.interationType === INTERATION_TYPE.SYNC) {
      if (values.clientId) params.set('clientId', values.clientId)
      if (values.purposeId) params.set('purposeId', values.purposeId)
      if (values.keyId) params.set('keyId', values.keyId)
    }

    if (values.interationType === INTERATION_TYPE.ASYNC) {
      params.set('memberType', values.memberType)

      if (values.asyncExchangeStep) {
        params.set('asyncExchangeStep', values.asyncExchangeStep)
      }

      if (values.memberType === MEMBER_TYPE.CONSUMER) {
        if (values.clientId) params.set('clientId', values.clientId)
        if (values.purposeId) params.set('purposeId', values.purposeId)
        if (values.keyId) params.set('keyId', values.keyId)
      }

      if (values.memberType === MEMBER_TYPE.PRODUCER) {
        if (values.producerKeychainId) params.set('producerKeychainId', values.producerKeychainId)
        if (values.eserviceId) params.set('eserviceId', values.eserviceId)
        if (values.publicKeyId) params.set('publicKeyId', values.publicKeyId)
      }
    }

    setSearchParams(params)
    startStepper(values)
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
              {
                value: VOUCHER_TYPE.BEARER,
                label: (
                  <Box sx={{ display: 'flex', flexDirection: 'column', py: 1 }}>
                    <Typography>{t('generalForm.voucherType.options.bearer.label')}</Typography>
                    <Typography variant="caption" color={'text.secondary'}>
                      {t('generalForm.voucherType.options.bearer.description')}
                    </Typography>
                  </Box>
                ),
              },
              {
                value: VOUCHER_TYPE.DPOP,
                label: (
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography>{t('generalForm.voucherType.options.dpop.label')}</Typography>
                    <Typography variant="caption" color={'text.secondary'}>
                      {t('generalForm.voucherType.options.dpop.description')}
                    </Typography>
                  </Box>
                ),
              },
            ]}
          />
          {clientKind === 'CONSUMER' && (
            <RHFRadioGroup
              name="interationType"
              label={t('generalForm.interationType.label')}
              required
              options={[
                {
                  value: INTERATION_TYPE.SYNC,
                  label: t('generalForm.interationType.options.sync'),
                },
                {
                  value: INTERATION_TYPE.ASYNC,
                  label: t('generalForm.interationType.options.async'),
                },
              ]}
              onValueChange={(interationType) =>
                handleInterationTypeChanged(interationType as InterationType)
              }
            />
          )}
          {values.interationType === INTERATION_TYPE.ASYNC && (
            <RHFRadioGroup
              name="memberType"
              label={t('generalForm.memberType.label')}
              required
              options={[
                {
                  value: MEMBER_TYPE.CONSUMER,
                  label: t('generalForm.memberType.options.consumer'),
                },
                {
                  value: MEMBER_TYPE.PRODUCER,
                  label: t('generalForm.memberType.options.producer'),
                },
              ]}
              onValueChange={(memberType) => handleMemberTypeChanged(memberType as MemberType)}
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
          {values.memberType === MEMBER_TYPE.CONSUMER && (
            <VoucherConsumerSimulationSection
              key={`consumer-${values.interationType}-${values.memberType}`}
            />
          )}

          {values.memberType === MEMBER_TYPE.PRODUCER && (
            <VoucherProducerSimulationSection
              key={`producer-${values.interationType}-${values.memberType}`}
            />
          )}

          {values.interationType === INTERATION_TYPE.ASYNC && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <RHFSelect
                required
                rules={{ required: true }}
                name="asyncExchangeStep"
                label={t('generalForm.asyncExchangeStep.label')}
                options={[
                  {
                    label: t('generalForm.asyncExchangeStep.startInteraction'),
                    value: ASYNC_EXCHANGE_STEP.START_INTERACTION,
                  },
                  {
                    label: t('generalForm.asyncExchangeStep.getResource'),
                    value: ASYNC_EXCHANGE_STEP.GET_RESOURCE,
                  },
                  {
                    label: t('generalForm.asyncExchangeStep.confirmation'),
                    value: ASYNC_EXCHANGE_STEP.CONFIRMATION,
                  },
                ]}
              />
            </FormControl>
          )}
        </SectionContainer>
        <StepActions
          forward={{
            label: t('beginSimulation'),
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

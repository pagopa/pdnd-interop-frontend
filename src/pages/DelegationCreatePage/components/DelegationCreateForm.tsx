import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Alert, Box, FormControlLabel, Stack, Switch } from '@mui/material'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import type { DelegationKind } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { useDialog } from '@/stores'
import { DelegationMutations, DelegationQueries } from '@/api/delegation'
import { useNavigate } from '@/router'
import { StepActions } from '@/components/shared/StepActions'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import { AuthHooks } from '@/api/auth'
import { AgreementQueries } from '@/api/agreement'
import { DelegationCreateEServiceAutocomplete } from './DelegationCreateEServiceAutocomplete'
import { DelegationCreateTenantAutocomplete } from './DelegationCreateTenantAutocomplete'

export type DelegationCreateFormValues = {
  eserviceId: string
  eserviceName: string
  eserviceDescription: string
  delegateId: string
}

type DelegationCreateFormProps = {
  delegationKind: DelegationKind
  setActiveStep: React.Dispatch<React.SetStateAction<'KIND' | 'FORM'>>
}

const defaultValues: DelegationCreateFormValues = {
  eserviceId: '',
  eserviceName: '',
  eserviceDescription: '',
  delegateId: '',
}

export const DelegationCreateForm: React.FC<DelegationCreateFormProps> = ({
  delegationKind,
  setActiveStep,
}) => {
  const { t } = useTranslation('party')
  const { jwt } = AuthHooks.useJwt()

  const [isExistingEservice, setIsExistingEservice] = useState(false)

  const { openDialog } = useDialog()

  const formMethods = useForm<DelegationCreateFormValues>({ defaultValues })

  const selectedEServiceId = formMethods.watch('eserviceId')

  const { data: agreements = [] } = useQuery({
    ...AgreementQueries.getList({
      limit: 50,
      offset: 0,
      consumersIds: [jwt?.organizationId as string],
      eservicesIds: [selectedEServiceId],
      states: ['ACTIVE', 'SUSPENDED'],
    }),
    enabled: Boolean(
      selectedEServiceId && jwt?.organizationId && delegationKind === 'DELEGATED_CONSUMER'
    ),
    select: (d) => d.results ?? [],
  })

  const { data: delegations = [] } = useQuery({
    ...DelegationQueries.getList({
      limit: 50,
      offset: 0,
      delegatorIds: [jwt?.organizationId as string],
      eserviceIds: [selectedEServiceId],
      kind: 'DELEGATED_CONSUMER',
      states: ['ACTIVE', 'WAITING_FOR_APPROVAL'],
    }),
    enabled: Boolean(
      selectedEServiceId && jwt?.organizationId && delegationKind === 'DELEGATED_CONSUMER'
    ),
    select: (d) => d.results ?? [],
  })

  const { mutate: createConsumerDelegation } = DelegationMutations.useCreateConsumerDelegation()
  const { mutate: createProducerDelegation } = DelegationMutations.useCreateProducerDelegation()
  const { mutate: createProducerDelegationAndEservice } =
    DelegationMutations.useCreateProducerDelegationAndEservice()

  const onSubmit = async (formValues: DelegationCreateFormValues) => {
    openDialog({
      type: 'delegations',
      onConfirm: () => onConfirm(formValues),
    })
  }

  const navigate = useNavigate()

  function onConfirm(formValues: DelegationCreateFormValues) {
    if (!isExistingEservice && delegationKind === 'DELEGATED_PRODUCER') {
      // if it is a producer delegation and isExistingEservice is false the eservice must be created
      createProducerDelegationAndEservice(
        {
          name: formValues.eserviceName,
          description: formValues.eserviceDescription,
          technology: 'REST',
          mode: 'DELIVER',
          delegateId: formValues.delegateId,
        },
        {
          onSuccess: () => {
            navigate('DELEGATIONS')
          },
        }
      )
      return
    }

    const createDelegationParams = {
      eserviceId: formValues.eserviceId,
      delegateId: formValues.delegateId,
    }

    if (delegationKind === 'DELEGATED_CONSUMER') {
      createConsumerDelegation(createDelegationParams, {
        onSuccess: () => {
          navigate('DELEGATIONS')
        },
      })
      return
    }

    createProducerDelegation(createDelegationParams, {
      onSuccess: () => {
        navigate('DELEGATIONS')
      },
    })
  }

  const hasAgreement = agreements.length > 0
  const isDelegated = delegations.length > 0

  const sectionTitle =
    delegationKind === 'DELEGATED_PRODUCER'
      ? t('delegations.create.provideDelegationTitle')
      : t('delegations.create.consumeDelegationTitle')

  return (
    <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
      <FormProvider {...formMethods}>
        <SectionContainer title={sectionTitle}>
          <Stack spacing={3}>
            {delegationKind === 'DELEGATED_PRODUCER' && (
              <FormControlLabel
                control={
                  <Switch
                    checked={isExistingEservice}
                    onChange={() => setIsExistingEservice((prev) => !prev)}
                  />
                }
                label={t('delegations.create.delegateField.provider.switch')}
                labelPlacement="end"
                componentsProps={{ typography: { variant: 'body2' } }}
              />
            )}
            {isExistingEservice || delegationKind === 'DELEGATED_CONSUMER' ? (
              <DelegationCreateEServiceAutocomplete delegationKind={delegationKind} />
            ) : (
              <>
                <RHFTextField
                  focusOnMount={true}
                  name="eserviceName"
                  label={t('delegations.create.eserviceField.label')}
                  infoLabel={t('delegations.create.eserviceField.infoLabel')}
                  inputProps={{ maxLength: 60 }}
                  rules={{ required: true, minLength: 5 }}
                  sx={{ my: 2 }}
                />
                <RHFTextField
                  name="eserviceDescription"
                  label={t('delegations.create.eserviceField.descriptionLabel')}
                  infoLabel={t('delegations.create.eserviceField.descriptionInfoLabel')}
                  multiline
                  size="small"
                  inputProps={{ maxLength: 250 }}
                  rules={{ required: true, minLength: 10 }}
                  sx={{ mb: 1, mt: 1 }}
                />
              </>
            )}
            <DelegationCreateTenantAutocomplete delegationKind={delegationKind} />
            {delegationKind === 'DELEGATED_CONSUMER' && (hasAgreement || isDelegated) && (
              <Alert severity="warning">
                {hasAgreement
                  ? t('delegations.create.hasAgreementsAlert')
                  : t('delegations.create.isDelegatedAlert')}
              </Alert>
            )}
          </Stack>
        </SectionContainer>
      </FormProvider>
      <StepActions
        back={{
          label: t('delegations.create.backWithoutSaveBtn'),
          type: 'button',
          startIcon: <ArrowBackIcon />,
          onClick: () => {
            setActiveStep('KIND')
          },
        }}
        forward={{
          label: t('delegations.create.submitBtn'),
          type: 'submit',
          startIcon: <SendIcon />,
          disabled: delegationKind === 'DELEGATED_CONSUMER' && (hasAgreement || isDelegated),
        }}
      />
    </Box>
  )
}

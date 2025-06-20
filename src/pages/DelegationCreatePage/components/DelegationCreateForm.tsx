import { Alert, Box, Stack } from '@mui/material'
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
import { DelegationCreateFormCreateEservice } from './DelegationCreateFormCreateEservice'
import { RHFSwitch } from '@/components/shared/react-hook-form-inputs'

export type DelegationCreateFormValues = {
  eserviceId: string
  eserviceName: string
  eserviceDescription: string
  delegateId: string
  isEserviceToBeCreated: boolean
  isEserviceFromTemplate?: boolean
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
  isEserviceToBeCreated: false,
  isEserviceFromTemplate: false,
}

export const DelegationCreateForm: React.FC<DelegationCreateFormProps> = ({
  delegationKind,
  setActiveStep,
}) => {
  const { t } = useTranslation('party')
  const { jwt } = AuthHooks.useJwt()

  const { openDialog } = useDialog()

  const formMethods = useForm<DelegationCreateFormValues>({ defaultValues })

  const selectedEServiceId = formMethods.watch('eserviceId')
  const isEserviceToBeCreated = formMethods.watch('isEserviceToBeCreated')
  const isEserviceFromTemplate = formMethods.watch('isEserviceFromTemplate')

  const { data: agreements = [] } = useQuery({
    ...AgreementQueries.getConsumerAgreementsList({
      limit: 50,
      offset: 0,
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
  const { mutate: createProducerDelegationAndEserviceFromTemplate } =
    DelegationMutations.useCreateProducerDelegationAndEserviceFromTemplate()

  const onSubmit = async (formValues: DelegationCreateFormValues) => {
    openDialog({
      type: 'basic',
      onProceed: () => onConfirm(formValues),
      title: t('delegations.create.dialog.title'),
      description: t('delegations.create.dialog.description'),
      checkbox: t('delegations.create.dialog.checkboxLabel'),
      proceedLabel: t('delegations.create.dialog.proceedLabel'),
    })
  }

  const navigate = useNavigate()

  function onConfirm(formValues: DelegationCreateFormValues) {
    if (
      isEserviceToBeCreated &&
      delegationKind === 'DELEGATED_PRODUCER' &&
      !isEserviceFromTemplate
    ) {
      // if it is a producer delegation and isEserviceToBeCreated is true the eservice must be created
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

    if (
      isEserviceToBeCreated &&
      delegationKind === 'DELEGATED_PRODUCER' &&
      isEserviceFromTemplate
    ) {
      createProducerDelegationAndEserviceFromTemplate(
        {
          delegateId: formValues.delegateId,
          eServiceTemplateId: formValues.eserviceId,
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
      ? t('delegations.create.providerDelegationTitle')
      : t('delegations.create.consumerDelegationTitle')

  const [, setEserviceTemplateName] = useState('')

  const handleTemplateNameAutocompleteChange = (eserviceTemplateName: string) => {
    setEserviceTemplateName(eserviceTemplateName)
  }

  return (
    <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
      <FormProvider {...formMethods}>
        <SectionContainer title={sectionTitle}>
          <Stack spacing={3}>
            {delegationKind === 'DELEGATED_PRODUCER' && (
              <RHFSwitch
                name="isEserviceToBeCreated"
                label={t('delegations.create.delegateField.provider.switch')}
              />
            )}
            {!isEserviceToBeCreated || delegationKind === 'DELEGATED_CONSUMER' ? (
              <DelegationCreateEServiceAutocomplete delegationKind={delegationKind} />
            ) : (
              <DelegationCreateFormCreateEservice
                delegationKind={delegationKind}
                handleTemplateNameAutocompleteChange={handleTemplateNameAutocompleteChange}
              />
            )}
            <DelegationCreateTenantAutocomplete delegationKind={delegationKind} />
            {delegationKind === 'DELEGATED_CONSUMER' && (hasAgreement || isDelegated) && (
              <Alert severity="warning">
                {isDelegated
                  ? t('delegations.create.isDelegatedAlert')
                  : t('delegations.create.hasAgreementsAlert')}
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

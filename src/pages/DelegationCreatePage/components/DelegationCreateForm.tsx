import { RHFAutocompleteSingle, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box, FormControlLabel, Stack, Switch } from '@mui/material'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EServiceQueries } from '@/api/eservice/eservice.queries'
import { useQuery } from '@tanstack/react-query'
import {
  CompactOrganization,
  DelegationKind,
  EServiceMode,
  EServiceTechnology,
  ProducerEService,
} from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { useDialog } from '@/stores'
import { TenantQueries } from '@/api/tenant'
import { DelegationMutations } from '@/api/delegation'
import { useNavigate } from '@/router'
import { StepActions } from '@/components/shared/StepActions'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'

export type FormParams = {
  eserviceName: string
  eserviceDescription: string
  eserviceTechnology: EServiceTechnology
  eserviceMode: EServiceMode
  delegateId: string
}

export type DelegationCreateFormValues = {
  eserviceName: string
  eserviceDescription: string
  delegateId: string
}

type DelegationCreateFormProps = {
  delegationKind: DelegationKind
  setActiveStep: React.Dispatch<React.SetStateAction<'KIND' | 'FORM'>>
}

const defaultValues: DelegationCreateFormValues = {
  eserviceName: '',
  eserviceDescription: '',
  delegateId: '',
}

export const DelegationCreateForm: React.FC<DelegationCreateFormProps> = ({
  delegationKind,
  setActiveStep,
}) => {
  const { t } = useTranslation('party')

  const [isExistingEservice, setIsExistingEservice] = useState(false)

  const { openDialog } = useDialog()

  const formMethods = useForm({ defaultValues })

  const formatAutocompleteOptionLabelEservice = React.useCallback(
    (eservice: ProducerEService) => {
      return `${eservice.name}`
    },
    [t]
  )

  const formatAutocompleteOptionLabelDelegate = React.useCallback(
    (delegate: CompactOrganization) => {
      return `${delegate.name}`
    },
    [t]
  )

  const { data: autocompleteEserviceOptions = [], isLoading: isLoadingEservices } = useQuery({
    ...EServiceQueries.getProviderList({
      limit: 50,
      offset: 0,
      delegated: false,
    }),
    select: (d) =>
      (d.results ?? []).map((eservice) => ({
        label: formatAutocompleteOptionLabelEservice(eservice),
        value: eservice,
      })),
  })

  const { data: autocompleteDelegateOptions = [], isLoading: isLoadingDelegates } = useQuery({
    ...TenantQueries.getTenants({
      limit: 50,
      features: ['DELEGATED_PRODUCER'],
    }),
    select: (d) =>
      (d.results ?? []).map((delegate) => ({
        label: formatAutocompleteOptionLabelDelegate(delegate),
        value: delegate,
      })),
  })

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
      const createDelegationAndEserviceParams: FormParams = {
        eserviceName: formValues.eserviceName,
        eserviceDescription: formValues.eserviceDescription,
        eserviceTechnology: 'REST',
        eserviceMode: 'DELIVER',
        delegateId: formValues.delegateId,
      }
      console.log('SONO QUIIII')
      createProducerDelegationAndEservice(createDelegationAndEserviceParams, {
        onSuccess: () => {
          navigate('DELEGATIONS')
        },
      })
    } else {
      const createDelegationParams = {
        eserviceId: formValues.eserviceName,
        delegateId: formValues.delegateId,
      }
      createProducerDelegation(createDelegationParams, {
        onSuccess: () => {
          navigate('DELEGATIONS')
        },
      })
    }
  }

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
                label={t('delegations.create.delegateField.provide.switch')}
                labelPlacement="end"
                componentsProps={{ typography: { variant: 'body2' } }}
              />
            )}
            {isExistingEservice || delegationKind === 'DELEGATED_CONSUMER' ? (
              <RHFAutocompleteSingle
                sx={{ my: 0 }}
                loading={isLoadingEservices}
                name="eserviceName"
                label={t('delegations.create.eserviceField.label')}
                infoLabel={t('delegations.create.eserviceField.infoLabelAutocomplete')}
                options={autocompleteEserviceOptions}
                rules={{ required: true }}
              />
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
            <RHFAutocompleteSingle
              sx={{ my: 0 }}
              loading={isLoadingDelegates}
              name="delegateId"
              label={
                delegationKind === 'DELEGATED_CONSUMER'
                  ? t(`delegations.create.delegateField.consume.label`)
                  : t(`delegations.create.delegateField.provide.label`)
              }
              infoLabel={
                delegationKind === 'DELEGATED_CONSUMER'
                  ? t('delegations.create.delegateField.consume.infoLabel')
                  : t('delegations.create.delegateField.provide.infoLabel')
              }
              options={autocompleteDelegateOptions}
              rules={{ required: true }}
            />
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
        }}
      />
    </Box>
  )
}

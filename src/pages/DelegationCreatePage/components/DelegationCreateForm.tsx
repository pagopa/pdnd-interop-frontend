import { RHFAutocompleteSingle, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box, FormControlLabel, Switch } from '@mui/material'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StepActions } from '@/components/shared/StepActions'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import { EServiceQueries } from '@/api/eservice/eservice.queries'
import { useQuery } from '@tanstack/react-query'
import {
  CompactOrganization,
  DelegationKind,
  EServiceMode,
  EServiceTechnology,
  ProducerEService,
} from '@/api/api.generatedTypes'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { SectionContainer } from '@/components/layout/containers'
import { useDialog } from '@/stores'
import { TenantQueries } from '@/api/tenant'

export type DelegationCreateFormValues = {
  eserviceName: string
  eserviceDescription: string
  delegateId: string
}

export type EServiceCreateDraftValues = {
  name: string
  description: string
  technology: EServiceTechnology
  mode: EServiceMode
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

  const [isChecked, setIsChecked] = useState(false)

  const { openDialog } = useDialog()

  const formMethods = useForm({ defaultValues })

  const onSubmit = async (formValues: DelegationCreateFormValues) => {
    if (!isChecked && delegationKind === 'DELEGATED_PRODUCER') {
      // if it is a producer delegation and isChecked is false the eservice must be created
      const eserviceParams: EServiceCreateDraftValues = {
        name: formValues.eserviceName,
        description: formValues.eserviceDescription,
        technology: 'REST',
        mode: 'DELIVER',
      }
      openDialog({
        type: 'delegations',
        eserviceParams: eserviceParams,
        delegationParams: { delegateId: formValues.delegateId },
      })
    } else {
      const delegationParams = {
        eserviceId: formValues.eserviceName,
        delegateId: formValues.delegateId,
      }
      openDialog({
        type: 'delegations',
        delegationParams: delegationParams,
      })
    }
  }

  const [eserviceAutocompleteTextInput, setEserviceAutocompleteTextInput] =
    useAutocompleteTextInput()

  const selectedEServiceRef = React.useRef<ProducerEService | undefined>(undefined)

  const formatAutocompleteOptionLabelEservice = React.useCallback(
    (eservice: ProducerEService) => {
      return `${eservice.name}`
    },
    [t]
  )

  const { data: eservices = [], isLoading: isLoadingEservices } = useQuery({
    ...EServiceQueries.getProviderList({
      limit: 50,
      offset: 0,
      delegated: false,
    }),
    select: (d) => d.results,
  })

  const { watch } = formMethods
  const [tenantSearchParam] = useAutocompleteTextInput()
  const selectedTenant = watch('delegateId')

  const { data: delegates = [], isLoading: isLoadingDelegates } = useQuery({
    ...TenantQueries.getTenants({
      limit: 50,
      features: ['DELEGATED_PRODUCER'],
    }),
    select: (d) => d.results,
  })

  const formatAutocompleteOptionLabelDelegate = React.useCallback(
    (delegate: CompactOrganization) => {
      return `${delegate.name}`
    },
    [t]
  )

  const autocompleteEserviceOptions = (eservices ?? []).map((eservice) => ({
    label: formatAutocompleteOptionLabelEservice(eservice),
    value: eservice,
  }))

  const autocompleteDelegateOptions = (delegates ?? []).map((delegate) => ({
    label: formatAutocompleteOptionLabelDelegate(delegate),
    value: delegate,
  }))

  return (
    <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
      <FormProvider {...formMethods}>
        {delegationKind === 'DELEGATED_PRODUCER' && (
          <SectionContainer innerSection>
            <FormControlLabel
              control={
                <Switch checked={isChecked} onChange={() => setIsChecked((prev) => !prev)} />
              }
              label={t('delegations.create.delegateField.provide.switch')}
              labelPlacement="end"
              componentsProps={{ typography: { variant: 'body2' } }}
            />
          </SectionContainer>
        )}
        <SectionContainer innerSection>
          {isChecked || delegationKind === 'DELEGATED_CONSUMER' ? (
            <RHFAutocompleteSingle
              sx={{ my: 0 }}
              loading={isLoadingEservices}
              name="eserviceName"
              label={t('delegations.create.eserviceField.label')}
              infoLabel={t('delegations.create.eserviceField.infoLabelAutocomplete')}
              options={autocompleteEserviceOptions}
              rules={{ required: true }}
              onValueChange={(value) => {
                selectedEServiceRef.current = eservices.find(
                  (eservice) => eservice.id === value?.value.id
                )
              }}
              onInputChange={(_, value) => setEserviceAutocompleteTextInput(value)}
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
        </SectionContainer>
        <SectionContainer innerSection>
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
            onValueChange={(value) => {
              selectedEServiceRef.current = eservices.find(
                (eservice) => eservice.id === value?.value.id
              )
            }}
            onInputChange={(_, value) => setEserviceAutocompleteTextInput(value)}
          />
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

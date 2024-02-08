import type { PurposeEServiceSeed, PurposeSeed, RiskAnalysisForm } from '@/api/api.generatedTypes'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { SectionContainer } from '@/components/layout/containers'
import { Box, Button, Divider, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { PurposeCreateEServiceAutocomplete } from './PurposeCreateEServiceAutocomplete'
import { AuthHooks } from '@/api/auth'
import { useNavigate } from '@/router'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { PurposeCreateProviderRiskAnalysisAutocomplete } from './PurposeCreateProviderRiskAnalysisAutocomplete'
import { PurposeCreateProviderRiskAnalysis } from './PurposeCreateProviderRiskAnalysis'
import { EServiceQueries } from '@/api/eservice'

export type PurposeCreateFormValues = {
  eserviceId: string | null
  useTemplate: boolean
  templateId: string | null
  providerRiskAnalysisId: string | null
}

export const PurposeCreateEServiceForm: React.FC = () => {
  const { t } = useTranslation('purpose')
  const navigate = useNavigate()
  const { jwt } = AuthHooks.useJwt()
  const { mutate: createPurposeDraft } = PurposeMutations.useCreateDraft()
  const { mutate: createPurposeDraftForReceiveEService } =
    PurposeMutations.useCreateDraftForReceiveEService()
  const location = useLocation()

  const formMethods = useForm<PurposeCreateFormValues>({
    defaultValues: {
      // get the default value of the e-service to associate to the purpose from the "e-service" url param,
      // if it is present
      eserviceId: new URLSearchParams(location.search).get('e-service') ?? '',
      useTemplate: false,
      templateId: null,
      providerRiskAnalysisId: null,
    },
  })

  const selectedEServiceId = formMethods.watch('eserviceId')
  const purposeId = formMethods.watch('templateId')
  const useTemplate = formMethods.watch('useTemplate')
  const isEServiceSelected = !!selectedEServiceId

  const selectedProviderRiskAnalysisId = formMethods.watch('providerRiskAnalysisId')
  const isProviderPurposeSelected = !!selectedProviderRiskAnalysisId

  const { data: purpose } = PurposeQueries.useGetSingle(purposeId!, {
    suspense: false,
    enabled: !!purposeId,
  })

  const { data: eservices } = EServiceQueries.useGetCatalogList(
    {
      agreementStates: ['ACTIVE'],
      // e-service might also be on 'DEPRECATED' state
      states: ['PUBLISHED'],
      limit: 50,
      offset: 0,
    },
    {
      suspense: false,
    }
  )

  const selectedEServiceDescriptorId = eservices?.results.find(
    (eservice) => eservice.id === selectedEServiceId
  )?.activeDescriptor?.id

  const { data: descriptor } = EServiceQueries.useGetDescriptorCatalog(
    selectedEServiceId!,
    selectedEServiceDescriptorId!,
    {
      suspense: false,
      enabled: !!selectedEServiceId && !!selectedEServiceDescriptorId,
    }
  )
  const mode = descriptor?.eservice.mode

  // const isSubmitBtnDisabled = !!(useTemplate && purposeId && !purpose)

  const onSubmit = ({ eserviceId, providerRiskAnalysisId }: PurposeCreateFormValues) => {
    if (!jwt?.organizationId || !eserviceId) return

    /**
     * An e-service cannot have two purposes with the same title.
     * To avoid this, we add the current date to the title to make it unique.
     */
    const currentDateString = new Intl.DateTimeFormat('it', {
      dateStyle: 'short',
      timeStyle: 'short',
    })
      .format()
      .replace(',', '')

    let title = `${t('create.defaultPurpose.title')} ${currentDateString}`
    let description = t('create.defaultPurpose.description')
    let riskAnalysisForm: undefined | RiskAnalysisForm

    if (useTemplate && purposeId && purpose) {
      title = `${purpose.title} — clone`
      description = purpose.description
      riskAnalysisForm = purpose.riskAnalysisForm
    }

    if (mode === 'RECEIVE') {
      if (!providerRiskAnalysisId) return

      const payloadCreatePurposeDraft: PurposeEServiceSeed = {
        consumerId: jwt?.organizationId,
        eserviceId,
        title,
        description,
        isFreeOfCharge: true,
        freeOfChargeReason: t('create.defaultPurpose.freeOfChargeReason'),
        dailyCalls: 1,
        riskAnalysisId: providerRiskAnalysisId,
      }

      createPurposeDraftForReceiveEService(payloadCreatePurposeDraft, {
        onSuccess(data) {
          const purposeId = data.id
          navigate('SUBSCRIBE_PURPOSE_EDIT', { params: { purposeId } })
        },
      })
    }

    if (mode === 'DELIVER') {
      const payloadCreatePurposeDraft: PurposeSeed = {
        consumerId: jwt?.organizationId,
        eserviceId,
        title,
        description,
        riskAnalysisForm,
        isFreeOfCharge: true,
        freeOfChargeReason: t('create.defaultPurpose.freeOfChargeReason'),
        dailyCalls: 1,
      }

      createPurposeDraft(payloadCreatePurposeDraft, {
        onSuccess(data) {
          const purposeId = data.id
          navigate('SUBSCRIBE_PURPOSE_EDIT', { params: { purposeId } })
        },
      })
    }
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer title={t('create.preliminaryInformationSectionTitle')}>
          <PurposeCreateEServiceAutocomplete />
          {/* {isEServiceSelected && mode === 'DELIVER' && (
            <>
              <RHFSwitch name="useTemplate" label={t('create.isTemplateField.label')} />
              <PurposeCreateTemplateAutocomplete />
            </>
          )} */}
        </SectionContainer>
        {/* <PurposeCreateRiskAnalysisPreview /> */}
        {isEServiceSelected && mode === 'RECEIVE' && (
          <SectionContainer
            title={t('create.eserviceRiskAnalysisSection.title')}
            description={t('create.eserviceRiskAnalysisSection.description')}
          >
            <Stack spacing={3}>
              <PurposeCreateProviderRiskAnalysisAutocomplete />
              {isProviderPurposeSelected && (
                <>
                  <Divider />
                  <PurposeCreateProviderRiskAnalysis />
                </>
              )}
            </Stack>
          </SectionContainer>
        )}
        <Stack direction="row" sx={{ mt: 4, justifyContent: 'right' }}>
          <Button variant="contained" type="submit" startIcon={<NoteAddIcon />}>
            {t('create.createNewPurposeBtn')}
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  )
}

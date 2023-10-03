import type { PurposeSeed, RiskAnalysisForm } from '@/api/api.generatedTypes'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { SectionContainer } from '@/components/layout/containers'
import { RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { Box, Button, Divider, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { PurposeCreateEServiceAutocomplete } from './PurposeCreateEServiceAutocomplete'
import { AuthHooks } from '@/api/auth'
import { useNavigate } from '@/router'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { PurposeCreateProviderPurposeAutocomplete } from './PurposeCreateProviderPurposeAutocomplete'
import { PurposeCreateProviderRiskAnalysis } from './PurposeCreateProviderRiskAnalysis'
import { EServiceQueries } from '@/api/eservice'

export type PurposeCreateFormValues = {
  eserviceId: string | null
  useTemplate: boolean
  templateId: string | null
  providerPurposeId: string | null
}

export const PurposeCreateEServiceForm: React.FC = () => {
  const { t } = useTranslation('purpose')
  const navigate = useNavigate()
  const { jwt } = AuthHooks.useJwt()
  const { mutate: createPurposeDraft } = PurposeMutations.useCreateDraft()
  const location = useLocation()

  const formMethods = useForm<PurposeCreateFormValues>({
    defaultValues: {
      // get the default value of the e-service to associate to the purpose from the "e-service" url param,
      // if it is present
      eserviceId: new URLSearchParams(location.search).get('e-service') ?? '',
      useTemplate: false,
      templateId: null,
      providerPurposeId: null,
    },
  })

  // const selectedEService = formMethods.watch('eserviceId')
  const purposeId = formMethods.watch('templateId')
  const useTemplate = formMethods.watch('useTemplate')
  // const isEServiceSelected = !!selectedEService

  const selectedProviderPurposeId = formMethods.watch('providerPurposeId')
  const isProviderPurposeSelected = !!selectedProviderPurposeId

  const { data: purpose } = PurposeQueries.useGetSingle(purposeId!, {
    suspense: false,
    enabled: !!purposeId,
  })

  const { data: descriptor } = EServiceQueries.useGetDescriptorCatalog(
    selectedEService!,
    purpose!.eservice.descriptor.id,
    {
      suspense: false,
      enabled: !!selectedEService,
    }
  )
  const mode = descriptor?.eservice.mode

  const isSubmitBtnDisabled = !!(useTemplate && purposeId && !purpose)

  const onSubmit = ({ eserviceId }: PurposeCreateFormValues) => {
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

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer newDesign title={t('create.preliminaryInformationSectionTitle')}>
          <PurposeCreateEServiceAutocomplete />
          {isEServiceSelected && mode === 'DELIVER' && (
            <>
              <RHFSwitch name="useTemplate" label={t('create.isTemplateField.label')} />
              <PurposeCreateTemplateAutocomplete />
            </>
          )} */}
        </SectionContainer>
        <PurposeCreateRiskAnalysisPreview />
        {isEServiceSelected && mode === 'RECEIVE' && (
          <SectionContainer
            newDesign
            title={'TODO Finalità da utilizzare'}
            description={
              'TODO L’e-service selezionato prevede che sia l’erogatore a ricevere dati dai fruitori. Puoi selezionare tra le finalità proposte dall’erogatore quella per la quale intendi inviare dati al suo e-service.'
            }
          >
            <Stack spacing={3}>
              <PurposeCreateProviderPurposeAutocomplete />
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

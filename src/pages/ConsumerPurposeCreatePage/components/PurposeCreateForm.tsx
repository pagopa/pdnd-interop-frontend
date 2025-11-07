import type {
  CatalogEService,
  CompactEService,
  GetCatalogPurposeTemplatesParams,
  PurposeEServiceSeed,
  PurposeFromTemplateSeed,
  PurposeSeed,
  RiskAnalysisForm,
  TenantKind,
} from '@/api/api.generatedTypes'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { SectionContainer } from '@/components/layout/containers'
import { Box, Button, Divider, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PurposeCreateEServiceAutocomplete } from './PurposeCreateEServiceAutocomplete'
import { AuthHooks } from '@/api/auth'
import { useNavigate } from '@/router'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { PurposeCreateProviderRiskAnalysisAutocomplete } from './PurposeCreateProviderRiskAnalysisAutocomplete'
import { EServiceQueries } from '@/api/eservice'
import { useQuery } from '@tanstack/react-query'
import { PurposeCreateConsumerAutocomplete } from './PurposeCreateConsumerAutocomplete'
import { EServiceRiskAnalysisInfoSummary } from '@/components/shared/RiskAnalysisInfoSummary'
import { PurposeCreatePurposeTemplateSection } from './PurposeCreatePurposeTemplateSection/PurposeCreatePurposeTemplateSection'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'

export type PurposeCreateFormValues = {
  consumerId: string
  eservice: CatalogEService | CompactEService | undefined
  useTemplate: boolean
  templateId: string | null
  providerRiskAnalysisId: string | null
  usePurposeTemplate: boolean | null
  purposeTemplateIdSelected: string | null
  tenantKind?: TenantKind
}

type PurposeCreateFormProps = {
  purposeTemplateId?: string
}

export const PurposeCreateForm: React.FC<PurposeCreateFormProps> = ({ purposeTemplateId }) => {
  const { t } = useTranslation('purpose')
  const navigate = useNavigate()
  const { jwt } = AuthHooks.useJwt()
  const { mutate: createPurposeDraft } = PurposeMutations.useCreateDraft()
  const { mutate: createPurposeDraftForReceiveEService } =
    PurposeMutations.useCreateDraftForReceiveEService()
  const { mutate: createPurposeDraftFromPurposeTemplate } =
    PurposeMutations.useCreateDraftFromPurposeTemplate()

  const formMethods = useForm<PurposeCreateFormValues>({
    defaultValues: {
      consumerId: jwt?.organizationId as string,
      eservice: undefined,
      useTemplate: false,
      templateId: null,
      providerRiskAnalysisId: null,
      usePurposeTemplate: purposeTemplateId ? true : false,
      tenantKind: undefined,
    },
  })

  const selectedEService = formMethods.watch('eservice')
  const purposeId = formMethods.watch('templateId')
  const useTemplate = formMethods.watch('useTemplate')
  const usePurposeTemplate = formMethods.watch('usePurposeTemplate')
  const purposeTemplateIdSelected = formMethods.watch('purposeTemplateIdSelected')

  const selectedProviderRiskAnalysisId = formMethods.watch('providerRiskAnalysisId')

  const { data: purpose } = useQuery({
    ...PurposeQueries.getSingle(purposeId!),
    enabled: Boolean(purposeId),
  })

  /**
   * TODO:
   * For now the e-service we have in the form state does not have the mode information (RECEIVE or DELIVER).
   * We need to query the catalog to get the e-service descriptor ID and then query the catalog again
   * to get the mode of the e-service.
   * This is a workaround until we have the mode information in the e-service object.
   *
   * We need to wait for this backend PR to be merged:
   * https://github.com/pagopa/interop-be-monorepo/pull/2061
   */
  const { data: selectedEServiceDescriptorId } = useQuery({
    ...EServiceQueries.getAllCatalogEServices({
      q: selectedEService?.name,
      producersIds: [selectedEService?.producer.id as string],
      states: ['PUBLISHED'],
    }),
    enabled: Boolean(selectedEService),
    select: (eservices) =>
      eservices.find((eservice) => eservice.id === selectedEService?.id)?.activeDescriptor?.id,
  })

  const queryParams: GetCatalogPurposeTemplatesParams = {
    limit: 50,
    offset: 0,
  }

  const { data: purposeTemplates, isLoading: isLoadingPurposeTemplates } = useQuery({
    ...PurposeTemplateQueries.getCatalogPurposeTemplates(queryParams),
  })

  const { data: selectedEServiceDescriptor } = useQuery({
    ...EServiceQueries.getDescriptorCatalog(
      selectedEService?.id as string,
      selectedEServiceDescriptorId!
    ),
    enabled: Boolean(selectedEService?.id && selectedEServiceDescriptorId),
  })

  const selectedEServiceMode = selectedEServiceDescriptor?.eservice.mode
  const handlesPersonalData = selectedEServiceDescriptor?.eservice.personalData
  const isPurposeTemplateCreateSectionVisible =
    !isLoadingPurposeTemplates && purposeTemplates?.results && purposeTemplates.results.length > 0

  // const isSubmitBtnDisabled = !!(useTemplate && purposeId && !purpose)

  const onSubmit = ({ consumerId, eservice, providerRiskAnalysisId }: PurposeCreateFormValues) => {
    if (!jwt?.organizationId || !eservice) return

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

    const payloadCreatePurposeDraftFromTemplate: PurposeFromTemplateSeed = {
      eserviceId: eservice.id,
      consumerId: consumerId,
      title,
      dailyCalls: 1,
    }

    if (usePurposeTemplate && purposeTemplateIdSelected) {
      createPurposeDraftFromPurposeTemplate(
        { ...payloadCreatePurposeDraftFromTemplate, purposeTemplateId: purposeTemplateIdSelected },
        {
          onSuccess(data) {
            const purposeId = data.id
            navigate('NOT_FOUND') //TODO: replace with correct route create purpose from template
          },
        }
      )
      return
    }

    if (selectedEServiceMode === 'RECEIVE') {
      if (!providerRiskAnalysisId) return

      const payloadCreatePurposeDraft: PurposeEServiceSeed = {
        consumerId: consumerId,
        eserviceId: eservice.id,
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
          navigate('SUBSCRIBE_PURPOSE_EDIT', {
            params: { purposeId },
          })
        },
      })
    }

    if (selectedEServiceMode === 'DELIVER') {
      const payloadCreatePurposeDraft: PurposeSeed = {
        consumerId: consumerId,
        eserviceId: eservice.id,
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
          navigate('SUBSCRIBE_PURPOSE_EDIT', {
            params: { purposeId },
          })
        },
      })
    }
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer title={t('create.preliminaryInformationSectionTitle')}>
          <Stack spacing={3}>
            <PurposeCreateConsumerAutocomplete
              preselectedConsumer={
                jwt ? { id: jwt?.organizationId, name: jwt?.organization.name } : undefined
              }
            />
            <PurposeCreateEServiceAutocomplete />
          </Stack>
        </SectionContainer>
        {selectedEServiceDescriptor && selectedEServiceMode === 'RECEIVE' && (
          <SectionContainer
            title={t('create.eserviceRiskAnalysisSection.title')}
            description={t('create.eserviceRiskAnalysisSection.description')}
          >
            <Stack spacing={3}>
              <PurposeCreateProviderRiskAnalysisAutocomplete
                eserviceRiskAnalysis={selectedEServiceDescriptor.eservice.riskAnalysis}
              />
              {selectedProviderRiskAnalysisId && (
                <>
                  <Divider />
                  <EServiceRiskAnalysisInfoSummary
                    eserviceId={selectedEServiceDescriptor.eservice.id}
                    riskAnalysisId={selectedProviderRiskAnalysisId}
                  />
                </>
              )}
            </Stack>
          </SectionContainer>
        )}
        {isPurposeTemplateCreateSectionVisible && (
          <SectionContainer
            title={t('create.purposeTemplateField.title')}
            description={t('create.purposeTemplateField.description')}
          >
            <Stack spacing={3}>
              <PurposeCreatePurposeTemplateSection
                eserviceId={selectedEService?.id as string}
                handlesPersonalData={handlesPersonalData}
                purposeTemplateId={purposeTemplateId}
              />
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

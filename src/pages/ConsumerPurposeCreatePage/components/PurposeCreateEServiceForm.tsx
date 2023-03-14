import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { PageBottomActionsContainer, SectionContainer } from '@/components/layout/containers'
import { RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { useJwt } from '@/hooks/useJwt'
import { RouterLink, useNavigateRouter } from '@/router'
import type { PurposeRiskAnalysisForm } from '@/types/purpose.types'
import { Box, Button, Grid } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { PurposeCreateEServiceAutocomplete } from './PurposeCreateEServiceAutocomplete'
import { PurposeCreateRiskAnalysisPreview } from './PurposeCreateRiskAnalysisPreview'
import { PurposeCreateTemplateAutocomplete } from './PurposeCreateTemplateAutocomplete'

export type PurposeCreateFormValues = {
  eserviceId: string | null
  useTemplate: boolean
  templateId: string | null
}

export const PurposeCreateEServiceForm: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { navigate } = useNavigateRouter()
  const { jwt } = useJwt()
  const { mutate: createPurposeDraft } = PurposeMutations.useCreateDraft()
  const { mutate: createVersionDraft } = PurposeMutations.useCreateVersionDraft()
  const location = useLocation()

  const formMethods = useForm<PurposeCreateFormValues>({
    defaultValues: {
      // get the default value of the e-service to associate to the purpose from the "e-service" url param,
      // if it is present
      eserviceId: new URLSearchParams(location.search).get('e-service') ?? '',
      useTemplate: false,
      templateId: null,
    },
  })

  const selectedEService = formMethods.watch('eserviceId')
  const purposeId = formMethods.watch('templateId')
  const useTemplate = formMethods.watch('useTemplate')
  const isEServiceSelected = !!selectedEService

  const { data: purpose } = PurposeQueries.useGetSingle(purposeId!, {
    suspense: false,
    enabled: !!purposeId,
  })

  const isSubmitBtnDisabled = !!(useTemplate && purposeId && !purpose)

  const onSubmit = ({ eserviceId }: PurposeCreateFormValues) => {
    if (!jwt?.organizationId || !eserviceId) return

    let title = t('create.defaultPurpose.title')
    let description = t('create.defaultPurpose.description')
    let riskAnalysisForm: undefined | PurposeRiskAnalysisForm

    if (useTemplate && purposeId && purpose) {
      title = `${purpose.title} — clone`
      description = purpose.description
      riskAnalysisForm = purpose.riskAnalysisForm
    }

    const payloadCreatePurposeDraft = {
      consumerId: jwt?.organizationId,
      eserviceId,
      title,
      description,
      riskAnalysisForm,
    }

    createPurposeDraft(payloadCreatePurposeDraft, {
      onSuccess(data) {
        const purposeId = data.id
        createVersionDraft(
          { purposeId, dailyCalls: 1 },
          { onSuccess: () => navigate('SUBSCRIBE_PURPOSE_EDIT', { params: { purposeId } }) }
        )
      },
    })
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={8}>
            <SectionContainer>
              <PurposeCreateEServiceAutocomplete />
              {isEServiceSelected && (
                <>
                  <RHFSwitch name="useTemplate" label={t('create.isTemplateField.label')} />
                  <PurposeCreateTemplateAutocomplete />
                </>
              )}
            </SectionContainer>
            <PurposeCreateRiskAnalysisPreview />
          </Grid>
        </Grid>
        <PageBottomActionsContainer>
          <RouterLink as="button" type="button" variant="outlined" to="SUBSCRIBE_PURPOSE_LIST">
            {t('create.backToListBtn')}
          </RouterLink>
          <Button variant="contained" type="submit" disabled={isSubmitBtnDisabled}>
            {t('create.createNewPurposeBtn')}
          </Button>
        </PageBottomActionsContainer>
      </Box>
    </FormProvider>
  )
}

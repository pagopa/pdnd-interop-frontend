import { PurposeMutations } from '@/api/purpose'
import {
  PageBottomActionsContainer,
  PageContainer,
  SectionContainer,
} from '@/components/layout/containers'
import { Switch } from '@/components/shared/ReactHookFormInputs'
import { useJwt } from '@/hooks/useJwt'
import { RouterLink, useNavigateRouter } from '@/router'
import { Purpose, PurposeRiskAnalysisForm } from '@/types/purpose.types'
import { Box, Button, Grid } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  PurposeCreateEServiceAutocomplete,
  PurposeCreateEServiceAutocompleteSkeleton,
} from './components/PurposeCreateEServiceAutocomplete'
import { PurposeCreateTemplateAutocomplete } from './components/PurposeCreateTemplateAutocomplete'

export type PurposeCreateFormValues = {
  eserviceId: string | null
  useTemplate: boolean
  template: Purpose | null
}

const defaultValues: PurposeCreateFormValues = {
  eserviceId: '',
  useTemplate: false,
  template: null,
}

const ConsumerPurposeCreatePage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { navigate } = useNavigateRouter()
  const { jwt } = useJwt()
  const { mutate: createPurposeDraft } = PurposeMutations.useCreateDraft()
  const { mutate: createVersionDraft } = PurposeMutations.useCreateVersionDraft()

  const formMethods = useForm<PurposeCreateFormValues>({
    defaultValues,
  })

  const isEServiceSelected = !!formMethods.watch('eserviceId')

  const onSubmit = ({ eserviceId, template }: PurposeCreateFormValues) => {
    if (!jwt?.organizationId || !eserviceId) return

    let title = t('create.defaultPurpose.title')
    let description = t('create.defaultPurpose.description')
    let riskAnalysisForm: undefined | PurposeRiskAnalysisForm

    if (template) {
      title = `${template.title} — clone`
      description = template.description
      riskAnalysisForm = template.riskAnalysisForm
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
    <PageContainer title={t('create.emptyTitle')}>
      <FormProvider {...formMethods}>
        <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Grid container>
            <Grid item xs={8}>
              <SectionContainer>
                <React.Suspense fallback={<PurposeCreateEServiceAutocompleteSkeleton />}>
                  <PurposeCreateEServiceAutocomplete />
                </React.Suspense>
                {isEServiceSelected && (
                  <>
                    <Switch name="useTemplate" label={t('create.isTemplateField.label')} />
                    <PurposeCreateTemplateAutocomplete />
                  </>
                )}
              </SectionContainer>
            </Grid>
          </Grid>
          <PageBottomActionsContainer>
            <RouterLink as="button" type="button" variant="outlined" to="SUBSCRIBE_PURPOSE_LIST">
              {t('create.backToListBtn')}
            </RouterLink>
            <Button variant="contained" type="submit">
              {t('create.createNewPurposeBtn')}
            </Button>
          </PageBottomActionsContainer>
        </Box>
      </FormProvider>
    </PageContainer>
  )
}

export default ConsumerPurposeCreatePage

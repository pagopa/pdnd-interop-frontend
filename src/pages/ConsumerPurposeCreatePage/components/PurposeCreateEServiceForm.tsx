import { PurposeMutations } from '@/api/purpose'
import {
  PageBottomActionsContainer,
  SectionContainer,
  SectionContainerSkeleton,
} from '@/components/layout/containers'
import { ButtonSkeleton } from '@/components/shared/MUISkeletons'
import { Switch } from '@/components/shared/ReactHookFormInputs'
import { useJwt } from '@/hooks/useJwt'
import { RouterLink, useNavigateRouter } from '@/router'
import { PurposeRiskAnalysisForm } from '@/types/purpose.types'
import { Box, Button, Grid } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PurposeCreateFormValues } from '../ConsumerPurposeCreate.page'
import {
  PurposeCreateEServiceAutocomplete,
  PurposeCreateEServiceAutocompleteSkeleton,
} from './PurposeCreateEServiceAutocomplete'
import { PurposeCreateRiskAnalysisPreview } from './PurposeCreateRiskAnalysisPreview'
import { PurposeCreateTemplateAutocomplete } from './PurposeCreateTemplateAutocomplete'

interface PurposeCreateEServiceFormProps {
  defaultValues: PurposeCreateFormValues
}

export const PurposeCreateEServiceForm: React.FC<PurposeCreateEServiceFormProps> = ({
  defaultValues,
}) => {
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
    <FormProvider {...formMethods}>
      <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={8}>
            <SectionContainer>
              <PurposeCreateEServiceAutocomplete />
              {isEServiceSelected && (
                <>
                  <Switch name="useTemplate" label={t('create.isTemplateField.label')} />
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
          <Button variant="contained" type="submit">
            {t('create.createNewPurposeBtn')}
          </Button>
        </PageBottomActionsContainer>
      </Box>
    </FormProvider>
  )
}

export const PurposeCreateEServiceFormSkeleton: React.FC = () => {
  return (
    <>
      <Grid container>
        <Grid item xs={8}>
          <SectionContainerSkeleton>
            <PurposeCreateEServiceAutocompleteSkeleton />
          </SectionContainerSkeleton>
        </Grid>
      </Grid>
      <PageBottomActionsContainer>
        <ButtonSkeleton width={100} />
        <ButtonSkeleton width={100} />
      </PageBottomActionsContainer>
    </>
  )
}

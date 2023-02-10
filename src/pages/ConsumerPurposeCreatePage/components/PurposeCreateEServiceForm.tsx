import { EServiceQueries } from '@/api/eservice'
import { PurposeMutations } from '@/api/purpose'
import { PageBottomActionsContainer } from '@/components/layout/containers'
import { AutocompleteSingle } from '@/components/shared/ReactHookFormInputs'
import { useJwt } from '@/hooks/useJwt'
import { RouterLink, useNavigateRouter } from '@/router'
import { PurposeRiskAnalysisForm } from '@/types/purpose.types'
import { Box, Button, Grid } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type PurposeCreateFormValues = {
  eserviceId: string | null
}

export const PurposeCreateEServiceForm: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { navigate } = useNavigateRouter()
  const { jwt } = useJwt()
  const { mutate: createPurposeDraft } = PurposeMutations.useCreateDraft()
  const { mutate: createVersionDraft } = PurposeMutations.useCreateVersionDraft()

  const formMethods = useForm<PurposeCreateFormValues>({
    defaultValues: {
      eserviceId: '',
    },
  })

  const selectedEService = formMethods.watch('eserviceId')

  const { data: eservices = [], isInitialLoading } = EServiceQueries.useGetListFlat(
    {
      callerId: jwt?.organizationId,
      consumerId: jwt?.organizationId,
      agreementStates: ['ACTIVE'],
      state: 'PUBLISHED',
    },
    {
      suspense: false,
      onSuccess(eservices) {
        if (!selectedEService && eservices.length > 0) {
          formMethods.setValue('eserviceId', eservices[0].id)
        }
      },
    }
  )

  const autocompleteOptions = React.useMemo(() => {
    return (eservices ?? []).map((eservice) => ({
      label: `${eservice.name} erogato da ${eservice.producerName}`,
      value: eservice.id,
    }))
  }, [eservices])

  const onSubmit = ({ eserviceId }: PurposeCreateFormValues) => {
    if (!jwt?.organizationId || !eserviceId) return

    const title = t('create.defaultPurpose.title')
    const description = t('create.defaultPurpose.description')
    let riskAnalysisForm: undefined | PurposeRiskAnalysisForm

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
            <AutocompleteSingle
              sx={{ my: 0 }}
              loading={isInitialLoading}
              name="eserviceId"
              label={t('create.eserviceField.label')}
              options={autocompleteOptions}
            />
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

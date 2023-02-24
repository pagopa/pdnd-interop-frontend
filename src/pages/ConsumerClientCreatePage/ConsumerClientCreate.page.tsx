import { ClientMutations } from '@/api/client'
import {
  PageBottomActionsContainer,
  PageContainer,
  SectionContainer,
} from '@/components/layout/containers'
import { TextField } from '@/components/shared/ReactHookFormInputs'
import { useClientKind } from '@/hooks/useClientKind'
import { RouterLink, useNavigateRouter } from '@/router'
import type { Client } from '@/types/client.types'
import type { SelfCareUser } from '@/types/party.types'
import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import OperatorsInputTable from './components/OperatorsInputTable'

export type CreateClientFormValues = {
  name: string
  description: string
  operators: Array<SelfCareUser>
}

const defaultValues: CreateClientFormValues = { name: '', description: '', operators: [] }

const ConsumerClientCreatePage: React.FC = () => {
  const { t } = useTranslation('client')
  const clientKind = useClientKind()
  const { navigate } = useNavigateRouter()
  const { mutateAsync: createClient } = ClientMutations.useCreate()
  const { mutateAsync: createInteropM2MClient } = ClientMutations.useCreateInteropM2M()
  const { mutateAsync: addOperator } = ClientMutations.useAddOperator({
    suppressSuccessToast: true,
  })

  const formMethods = useForm<CreateClientFormValues>({
    defaultValues,
  })

  const onSubmit = async ({ name, description, operators }: CreateClientFormValues) => {
    const dataToPost = {
      name,
      description,
    }

    let data: Client | null = null

    if (clientKind === 'CONSUMER') {
      data = await createClient(dataToPost)
    }

    if (clientKind === 'API') {
      data = await createInteropM2MClient(dataToPost)
    }

    if (data) {
      await Promise.all(
        operators.map((operator) =>
          addOperator({ clientId: data!.id, relationshipId: operator.id })
        )
      )

      const destination =
        clientKind === 'CONSUMER' ? 'SUBSCRIBE_CLIENT_EDIT' : 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT'

      navigate(destination, { params: { clientId: data.id } })
    }
  }

  const backToRoute = clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M' : 'SUBSCRIBE_CLIENT_LIST'

  return (
    <PageContainer title={t('create.title')} description={t('create.description')}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <FormProvider {...formMethods}>
          <Grid container>
            <Grid item xs={8}>
              <SectionContainer>
                <Typography sx={{ mb: 2 }} component="h2" variant="h5">
                  {t('create.infoSectionTitle')}
                </Typography>

                <TextField
                  focusOnMount={true}
                  name="name"
                  label={t('create.nameField.label')}
                  infoLabel={t('create.nameField.infoLabel')}
                  inputProps={{ maxLength: 60 }}
                  rules={{ required: true, minLength: 5 }}
                />

                <TextField
                  name="description"
                  label={t('create.descriptionField.label')}
                  infoLabel={t('create.descriptionField.infoLabel')}
                  multiline
                  inputProps={{ maxLength: 250 }}
                  rules={{ required: true, minLength: 10 }}
                />

                <Typography sx={{ my: 4 }} component="h2" variant="h5">
                  {t('create.clientOperatorsSectionTitle')}
                </Typography>

                <OperatorsInputTable />
              </SectionContainer>
            </Grid>
          </Grid>
        </FormProvider>
        <PageBottomActionsContainer>
          <RouterLink as="button" variant="outlined" to={backToRoute}>
            {t('create.actions.backToClientsLabel')}
          </RouterLink>
          <Button variant="contained" type="submit">
            {t('create.actions.createLabel')}
          </Button>
        </PageBottomActionsContainer>
      </Box>
    </PageContainer>
  )
}

export default ConsumerClientCreatePage

import { ClientMutations } from '@/api/client'
import {
  PageBottomActionsContainer,
  PageContainer,
  SectionContainer,
} from '@/components/layout/containers'
import { TextField } from '@/components/shared/ReactHookFormInputs'
import { useClientKind } from '@/hooks/useClientKind'
import { RouterLink, useNavigateRouter } from '@/router'
import { Client } from '@/types/client.types'
import { SelfCareUser } from '@/types/party.types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { object, string, array } from 'yup'
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

  const validationSchema = object({
    name: string().required().min(5),
    description: string().required().min(10),
    operators: array(object({ id: string().required() })),
  })

  const formMethods = useForm<CreateClientFormValues>({
    resolver: yupResolver(validationSchema),
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
      <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
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
                />

                <TextField
                  name="description"
                  label={t('create.descriptionField.label')}
                  infoLabel={t('create.descriptionField.infoLabel')}
                  multiline
                  inputProps={{ maxLength: 250 }}
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

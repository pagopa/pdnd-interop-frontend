import { ClientMutations } from '@/api/client'
import { PageContainer, SectionContainer } from '@/components/layout/containers'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { useClientKind } from '@/hooks/useClientKind'
import { useNavigate } from '@/router'
import { Box, Button, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import OperatorsInputTable from './components/OperatorsInputTable'
import PublishIcon from '@mui/icons-material/Publish'
import type { Users } from '@/api/api.generatedTypes'

export type CreateClientFormValues = {
  name: string
  description: string
  operators: Users
}

const defaultValues: CreateClientFormValues = { name: '', description: '', operators: [] }

const ConsumerClientCreatePage: React.FC = () => {
  const { t } = useTranslation('client')
  const clientKind = useClientKind()
  const navigate = useNavigate()
  const { mutate: createClient } = ClientMutations.useCreate()
  const { mutate: createInteropM2MClient } = ClientMutations.useCreateInteropM2M()

  const formMethods = useForm<CreateClientFormValues>({
    defaultValues,
  })

  const onSubmit = async ({ name, description, operators }: CreateClientFormValues) => {
    const dataToPost = {
      name,
      description,
      members: operators.map((operator) => operator.userId),
    }

    if (clientKind === 'CONSUMER') {
      createClient(dataToPost, {
        onSuccess(data) {
          navigate('SUBSCRIBE_CLIENT_EDIT', { params: { clientId: data.id } })
        },
      })
    }

    if (clientKind === 'API') {
      createInteropM2MClient(dataToPost, {
        onSuccess(data) {
          navigate('SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT', { params: { clientId: data.id } })
        },
      })
    }
  }

  const backToRoute = clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M' : 'SUBSCRIBE_CLIENT_LIST'

  return (
    <PageContainer
      title={t('create.title')}
      description={t('create.description')}
      backToAction={{
        label: t('create.actions.backToClientsLabel'),
        to: backToRoute,
      }}
    >
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <FormProvider {...formMethods}>
          <SectionContainer newDesign title={t('create.infoSectionTitle')} component="div">
            <RHFTextField
              focusOnMount={true}
              name="name"
              label={t('create.nameField.label')}
              infoLabel={t('create.nameField.infoLabel')}
              inputProps={{ maxLength: 60 }}
              rules={{ required: true, minLength: 5 }}
              sx={{ my: 2 }}
            />

            <RHFTextField
              name="description"
              label={t('create.descriptionField.label')}
              infoLabel={t('create.descriptionField.infoLabel')}
              multiline
              inputProps={{ maxLength: 250 }}
              rules={{ required: true, minLength: 10 }}
              sx={{ my: 2 }}
            />
          </SectionContainer>

          <SectionContainer
            newDesign
            title={t('create.clientOperatorsSection.title')}
            description={t('create.clientOperatorsSection.description')}
            component="div"
          >
            <OperatorsInputTable />
          </SectionContainer>
        </FormProvider>
        <Stack direction="row" sx={{ mt: 4, justifyContent: 'right' }}>
          <Button variant="contained" type="submit" startIcon={<PublishIcon />}>
            {t('create.actions.createLabel')}
          </Button>
        </Stack>
      </Box>
    </PageContainer>
  )
}

export default ConsumerClientCreatePage

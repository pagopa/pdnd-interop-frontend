import { PageContainer, SectionContainer } from '@/components/layout/containers'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { useNavigate } from '@/router'
import { Box, Button, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { UsersInputTable } from './components/UsersInputTable'
import PublishIcon from '@mui/icons-material/Publish'
import type { Users } from '@/api/api.generatedTypes'
import { KeychainMutations } from '@/api/keychain/keychain.mutations'

export type CreateKeychainFormValues = {
  name: string
  description: string
  users: Users
}

const defaultValues: CreateKeychainFormValues = { name: '', description: '', users: [] }

const ProviderKeychainCreatePage: React.FC = () => {
  const { t } = useTranslation('keychain')
  const navigate = useNavigate()
  const { mutate: createKeychain } = KeychainMutations.useCreateKeychain()

  const formMethods = useForm<CreateKeychainFormValues>({
    defaultValues,
  })

  const onSubmit = async ({ name, description, users }: CreateKeychainFormValues) => {
    const dataToPost = {
      name,
      description,
      members: users.map((user) => user.userId),
    }
    createKeychain(dataToPost, {
      onSuccess(data) {
        navigate('SUBSCRIBE_CLIENT_EDIT', { params: { clientId: data.id } }) //navigate to keychain's details?  { params: { producerKeychainId: data.id } }
      },
    })
  }

  return (
    <PageContainer
      title={t('create.title')}
      backToAction={{
        label: t('create.actions.backToKeychainsLabel'),
        to: 'PROVIDE_KEYCHAINS_LIST',
      }}
    >
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <FormProvider {...formMethods}>
          <SectionContainer title={t('create.infoSectionTitle')} component="div">
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
            title={t('create.keychainUsersSection.title')}
            description={t('create.keychainUsersSection.description')}
            component="div"
          >
            <UsersInputTable />
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

export default ProviderKeychainCreatePage

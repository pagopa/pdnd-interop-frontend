import { ClientMutations } from '@/api/client'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Link } from '@/router'
import { Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

type ClientAddPublicKeyDrawerProps = {
  clientId: string
  isOpen: boolean
  onClose: VoidFunction
}

type UpdatePartyMailFormValues = {
  name: string
  key: string
}

export const ClientAddPublicKeyDrawer: React.FC<ClientAddPublicKeyDrawerProps> = ({
  isOpen,
  onClose,
  clientId,
}) => {
  const { t } = useTranslation('client', { keyPrefix: 'create.addPublicKeyDrawer' })

  const { mutate: postKey } = ClientMutations.usePostKey()
  const formMethods = useForm<UpdatePartyMailFormValues>({ defaultValues: { name: '', key: '' } })

  const handleSubmit = formMethods.handleSubmit((values) => {
    const { key, name } = values
    postKey(
      { clientId, payload: [{ use: 'SIG', alg: 'RS256', name, key: window.btoa(key.trim()) }] },
      { onSuccess: onClose }
    )
  })

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={t('title')}
        subtitle={
          <Trans components={{ 1: <Link to="SECURITY_KEY_GUIDE" target="_blank" /> }}>
            {t('description')}
          </Trans>
        }
        buttonAction={{
          label: t('insertAction'),
          action: handleSubmit,
        }}
        onTransitionExited={formMethods.reset}
      >
        <Stack spacing={4} component="form" noValidate onSubmit={handleSubmit}>
          <RHFTextField
            name="name"
            label={t('nameInput.label')}
            infoLabel={t('nameInput.infoLabel')}
            labelType="external"
            focusOnMount
            inputProps={{ maxLength: 60 }}
            rules={{ required: true, minLength: 5 }}
          />
          <RHFTextField
            name="key"
            label={t('publicKeyInput.label')}
            labelType="external"
            multiline
            rows={12}
            sx={{ mb: 2 }}
            rules={{ required: true }}
          />
        </Stack>
      </Drawer>
    </FormProvider>
  )
}

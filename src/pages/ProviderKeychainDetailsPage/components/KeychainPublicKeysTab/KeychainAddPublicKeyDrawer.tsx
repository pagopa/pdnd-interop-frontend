import { KeychainMutations } from '@/api/keychain/keychain.mutations'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { generateKeyGuideLink } from '@/config/constants'
import { Link, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

type KeychainAddPublicKeyDrawerProps = {
  keychainId: string
  isOpen: boolean
  onClose: VoidFunction
}

type AddPublicKeyFormValues = {
  name: string
  key: string
}

export const KeychainAddPublicKeyDrawer: React.FC<KeychainAddPublicKeyDrawerProps> = ({
  isOpen,
  onClose,
  keychainId,
}) => {
  const { t } = useTranslation('keychain', { keyPrefix: 'drawers.addPublicKeyDrawer' })
  const { t: tCommon } = useTranslation('common')

  const { mutate: createKey } = KeychainMutations.useCreateProducerKeychainKey()
  const formMethods = useForm<AddPublicKeyFormValues>({ defaultValues: { name: '', key: '' } })

  const handleSubmit = formMethods.handleSubmit((values) => {
    const { key, name } = values
    createKey(
      {
        producerKeychainId: keychainId,
        payload: { use: 'SIG', alg: 'RS256', name, key: window.btoa(key.trim()) },
      },
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
          <Trans
            components={{
              1: <Link underline="hover" href={generateKeyGuideLink} target="_blank" />,
            }}
          >
            {t('subtitle')}
          </Trans>
        }
        buttonAction={{
          label: tCommon('actions.insert'),
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

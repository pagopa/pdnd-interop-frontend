import type { Mail } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { TenantMutations } from '@/api/tenant'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { emailRegex } from '@/utils/form.utils'
import { Alert, Stack, Box } from '@mui/material'
import isEqual from 'lodash/isEqual'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UpdatePartyMailFormValues = {
  contactEmail: string
  description: string
}

type UpdatePartyMailDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  email?: Mail
}

export const UpdatePartyMailDrawer: React.FC<UpdatePartyMailDrawerProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const { t } = useTranslation('party', { keyPrefix: 'contacts' })
  const { t: tCommon } = useTranslation('common')
  const { jwt } = AuthHooks.useJwt()

  const { mutateAsync: updateMail } = TenantMutations.useUpdateMail()

  const defaultValues = {
    contactEmail: email?.address ?? '',
    description: email?.description ?? '',
  }

  const formMethods = useForm<UpdatePartyMailFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({ contactEmail: email?.address ?? '', description: email?.description ?? '' })
  }, [email, formMethods])

  const onSubmit = (values: UpdatePartyMailFormValues) => {
    if (!jwt?.organizationId) return
    if (!isEqual(defaultValues, values)) {
      const { contactEmail, description } = values
      updateMail(
        {
          partyId: jwt.organizationId,
          address: contactEmail,
          kind: 'CONTACT_EMAIL',
          description: description || undefined,
        },
        {
          onSuccess() {
            onClose()
          },
        }
      )
    }
  }

  const handleCloseDrawer = () => {
    onClose()
  }

  const handleTransitionExited = () => {
    formMethods.reset(defaultValues)
  }

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onClose={handleCloseDrawer}
        title={email?.address ? t('drawer.title.edit') : t('drawer.title.insert')}
        subtitle={t('drawer.subtitle')}
        buttonAction={{
          label: email?.address ? tCommon('actions.upgrade') : tCommon('actions.insert'),
          action: formMethods.handleSubmit(onSubmit),
        }}
        onTransitionExited={handleTransitionExited}
      >
        <Stack spacing={4}>
          <Box component="form" noValidate>
            <RHFTextField
              sx={{ mt: 2, mb: 0 }}
              focusOnMount
              name="contactEmail"
              label={t('drawer.mailField.label')}
              rules={{
                required: true,
                pattern: {
                  value: emailRegex,
                  message: tCommon('validation.string.email'),
                },
              }}
            />
            <RHFTextField
              sx={{ mt: 2, mb: 0 }}
              name="description"
              label={t('drawer.descriptionField.label')}
              infoLabel={t('drawer.descriptionField.infoLabel')}
              inputProps={{ maxLength: 250 }}
              multiline
              rules={{
                validate: (value) =>
                  !value ||
                  (value as string).length >= 10 ||
                  tCommon('validation.string.minLength', { min: 10 }),
              }}
            />
          </Box>
          {email?.address && (
            <Alert variant="outlined" severity="info">
              {t('drawer.mailChangeAlert')}
            </Alert>
          )}
        </Stack>
      </Drawer>
    </FormProvider>
  )
}

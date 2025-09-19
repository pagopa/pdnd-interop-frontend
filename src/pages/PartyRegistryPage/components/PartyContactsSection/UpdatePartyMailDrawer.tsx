import type { Mail } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { NotificationMutations } from '@/api/notification'
import { TenantMutations } from '@/api/tenant'
import { Drawer } from '@/components/shared/Drawer'
import {
  RHFSwitch,
  RHFTextField,
  SwitchLabelDescription,
} from '@/components/shared/react-hook-form-inputs'
import { emailRegex } from '@/utils/form.utils'
import { Alert, Stack, Box } from '@mui/material'
import isEqual from 'lodash/isEqual'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UpdatePartyMailFormValues = {
  contactEmail: string
  description: string
  enabledTenantNotificationConfigEmail: boolean
}

type UpdatePartyMailDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  email?: Mail
  enabledTenantNotificationConfigEmail?: boolean
}

export const UpdatePartyMailDrawer: React.FC<UpdatePartyMailDrawerProps> = ({
  isOpen,
  onClose,
  email,
  enabledTenantNotificationConfigEmail,
}) => {
  const { t } = useTranslation('party', { keyPrefix: 'contacts' })
  const { t: tCommon } = useTranslation('common')
  const { jwt, currentRoles } = AuthHooks.useJwt()

  const { mutateAsync: updateMail } = TenantMutations.useUpdateMail()
  const { mutate: updateNotificationTenantConfigs } =
    NotificationMutations.useUpdateNotificationTenantConfigs()

  const defaultValues = {
    contactEmail: email?.address ?? '',
    description: email?.description ?? '',
    enabledTenantNotificationConfigEmail: enabledTenantNotificationConfigEmail ?? false,
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
            console.log('invio il valore di notifica:', values.enabledTenantNotificationConfigEmail)
            updateNotificationTenantConfigs({
              enabled: values.enabledTenantNotificationConfigEmail,
            })
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
          {currentRoles.includes('admin') && (
            <Box>
              <RHFSwitch
                sx={{ ml: 2 }}
                data-testid="enable-notification-tenant-email"
                name="enabledTenantNotificationConfigEmail"
                label={
                  <SwitchLabelDescription
                    label=""
                    description={t('drawer.notificationActivationField.label')}
                  />
                }
              />
            </Box>
          )}
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

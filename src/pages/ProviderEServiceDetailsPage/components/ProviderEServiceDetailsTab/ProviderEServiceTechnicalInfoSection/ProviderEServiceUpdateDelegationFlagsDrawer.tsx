import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { EServiceMutations } from '@/api/eservice'
import { Drawer } from '@/components/shared/Drawer'
import { RHFCheckbox, RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { delegationEServiceGuideLink, delegationGuideLink } from '@/config/constants'
import { Alert, Box, Link, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

type UpdateDelegationFlagsFormValues = {
  isConsumerDelegable: boolean
  isClientAccessDelegable: boolean
}

type ProviderEServiceUpdateDelegationFlagsDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  descriptor: ProducerEServiceDescriptor
}

export const ProviderEServiceUpdateDelegationFlagsDrawer: React.FC<
  ProviderEServiceUpdateDelegationFlagsDrawerProps
> = ({ isOpen, onClose, descriptor }) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateDelegationsDrawer',
  })
  const { t: tCommon } = useTranslation('common')

  const { mutate: updateDelegationFlags } =
    EServiceMutations.useUpdateEServiceDelegationFlagsAfterPublication()

  const defaultValues = {
    isConsumerDelegable: descriptor.eservice.isConsumerDelegable,
    isClientAccessDelegable: descriptor.eservice.isClientAccessDelegable,
  }

  const { isAdmin } = AuthHooks.useJwt()

  const formMethods = useForm<UpdateDelegationFlagsFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({
      isConsumerDelegable: descriptor.eservice.isConsumerDelegable ?? false,
      isClientAccessDelegable: descriptor.eservice.isClientAccessDelegable ?? false,
    })
  }, [descriptor, formMethods])

  const onSubmit = (values: UpdateDelegationFlagsFormValues) => {
    if (values.isConsumerDelegable === false && values.isClientAccessDelegable === true) {
      // This case should not happen because the checkbox for isClientAccessDelegable is only shown if isConsumerDelegable is true, but we put this check just in case the user set true for isClientAccessDelegable and then set false for isConsumerDelegable before submitting the form
      updateDelegationFlags(
        {
          eserviceId: descriptor.eservice.id,
          isConsumerDelegable: values.isConsumerDelegable,
          isClientAccessDelegable: false,
        },
        { onSuccess: onClose }
      )
      return
    }
    updateDelegationFlags(
      {
        eserviceId: descriptor.eservice.id,
        isConsumerDelegable: values.isConsumerDelegable,
        isClientAccessDelegable: values.isClientAccessDelegable,
      },
      { onSuccess: onClose }
    )
  }

  const handleCloseDrawer = () => {
    onClose()
  }

  const handleTransitionExited = () => {
    formMethods.reset(defaultValues)
  }

  const isConsumerDelegableValue = formMethods.watch('isConsumerDelegable')

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onClose={handleCloseDrawer}
        title={t('title')}
        subtitle={
          <Trans
            components={{
              1: <Link underline="hover" href={delegationGuideLink} target="_blank" />,
            }}
          >
            {t('subtitle')}
          </Trans>
        }
        buttonAction={{
          label: tCommon('actions.saveEdits'),
          action: formMethods.handleSubmit(onSubmit),
        }}
        onTransitionExited={handleTransitionExited}
      >
        {!isAdmin && (
          <Alert severity="warning" variant="outlined" sx={{ mt: 0 }}>
            {t('alert')}
          </Alert>
        )}
        <Box component="form" noValidate>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
            {t('isConsumerDelegableField.label')}
          </Typography>
          <RHFSwitch
            name="isConsumerDelegable"
            label={t('isConsumerDelegableField.switchLabel')}
            sx={{ mt: 0 }}
          />
          {isConsumerDelegableValue && (
            <>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                {t('isClientAccessDelegableField.label')}
              </Typography>
              <RHFCheckbox
                name="isClientAccessDelegable"
                label={
                  <Trans
                    components={{
                      1: (
                        <Link
                          underline="hover"
                          href={delegationEServiceGuideLink}
                          target="_blank"
                        />
                      ),
                    }}
                  >
                    {t('isClientAccessDelegableField.checkboxLabel')}
                  </Trans>
                }
                sx={{ mt: 0 }}
              />
            </>
          )}
        </Box>
      </Drawer>
    </FormProvider>
  )
}

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

  const defaultValues = React.useMemo(
    () => ({
      isConsumerDelegable: descriptor.eservice.isConsumerDelegable ?? false,
      isClientAccessDelegable: descriptor.eservice.isClientAccessDelegable ?? false,
    }),
    [descriptor]
  )

  const { isAdmin } = AuthHooks.useJwt()

  const formMethods = useForm<UpdateDelegationFlagsFormValues>({ defaultValues })
  const isConsumerDelegableValue = formMethods.watch('isConsumerDelegable')

  React.useEffect(() => {
    formMethods.reset(defaultValues)
  }, [defaultValues, formMethods])

  const onSubmit = (values: UpdateDelegationFlagsFormValues) => {
    //we put this check just in case the user set true for isClientAccessDelegable and then set false for isConsumerDelegable before submitting the form
    const normalizedIsClientAccessDelegable = values.isConsumerDelegable
      ? values.isClientAccessDelegable
      : false
    updateDelegationFlags(
      {
        eserviceId: descriptor.eservice.id,
        isConsumerDelegable: values.isConsumerDelegable,
        isClientAccessDelegable: normalizedIsClientAccessDelegable,
      },
      { onSuccess: onClose }
    )
  }

  const handleTransitionExited = () => {
    formMethods.reset(defaultValues)
  }

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={t('title')}
        subtitle={
          <Trans
            components={{
              1: (
                <Link
                  underline="hover"
                  href={delegationGuideLink}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
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
                          rel="noopener noreferrer"
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

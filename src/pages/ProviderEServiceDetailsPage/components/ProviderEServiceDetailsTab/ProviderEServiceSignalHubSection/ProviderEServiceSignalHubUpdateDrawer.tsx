import { SectionContainer } from '@/components/layout/containers'
import { Drawer } from '@/components/shared/Drawer'
import { IconLink } from '@/components/shared/IconLink'
import { RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { Alert, Box, Link, Stack, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import LaunchIcon from '@mui/icons-material/Launch'
import { SIGNALHUB_PERSONAL_DATA_PROCESS_URL } from '@/config/env'
import { AuthHooks } from '@/api/auth'
import { SIGNALHUB_GUIDE_URL } from '@/config/constants'

type UpdateSignalHubFormValues = {
  isSignalHubEnabled: boolean
}

type UpdateSignalHubDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  id: string
  isSignalHubEnabled: boolean
  onSubmit: (id: string, newValue: boolean) => void
}

export const ProviderEServiceSignalHubUpdateDrawer: React.FC<UpdateSignalHubDrawerProps> = ({
  isOpen,
  onClose,
  id,
  isSignalHubEnabled,
  onSubmit,
}) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('eservice', { keyPrefix: 'read.drawers.updateSignalHubDrawer' })

  const { isAdmin } = AuthHooks.useJwt()

  const defaultValues = {
    isSignalHubEnabled: isSignalHubEnabled,
  }

  const formMethods = useForm<UpdateSignalHubFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({ isSignalHubEnabled: isSignalHubEnabled })
  }, [isSignalHubEnabled, formMethods])

  const handleSubmit = (values: UpdateSignalHubFormValues) => {
    onSubmit(id, values.isSignalHubEnabled)
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
        onTransitionExited={handleTransitionExited}
        onClose={handleCloseDrawer}
        title={t('title')}
        buttonAction={{
          action: formMethods.handleSubmit(handleSubmit),
          label: tCommon('actions.upgrade'),
        }}
      >
        <Box component="form" noValidate>
          <Stack spacing={1}>
            <Typography>
              {t('description.firstParagraph.before')}{' '}
              <IconLink
                href={SIGNALHUB_GUIDE_URL}
                target="_blank"
                endIcon={<LaunchIcon fontSize="small" />}
              >
                {t('description.firstParagraph.linkLabel')}
              </IconLink>{' '}
              {t('description.firstParagraph.after')}
            </Typography>
            <Typography>
              {t('description.secondParagraph.before')}{' '}
              <Link href={SIGNALHUB_PERSONAL_DATA_PROCESS_URL} target="_blank" underline="none">
                {t('description.secondParagraph.linkLabel')}
              </Link>{' '}
              {t('description.secondParagraph.after')}
            </Typography>
          </Stack>
          <SectionContainer innerSection sx={{ mt: 3 }}>
            <Stack spacing={2}>
              {!isAdmin && <Alert severity="warning">{t('alert')}</Alert>}
              <RHFSwitch label={t('switchLabel')} name="isSignalHubEnabled" sx={{ my: 0, ml: 1 }} />
            </Stack>
          </SectionContainer>
        </Box>
      </Drawer>
    </FormProvider>
  )
}

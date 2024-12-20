import { EServiceMutations } from '@/api/eservice'
import { Drawer } from '@/components/shared/Drawer'
import { RHFSingleFileInput } from '@/components/shared/react-hook-form-inputs'
import { importExportEServiceGuideLink } from '@/config/constants'
import { trackEvent } from '@/config/tracking'
import { useNavigate } from '@/router'
import { Box, FormControlLabel, Link, Stack, Switch, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { isAxiosError } from 'axios'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

type EServiceImportVersionDocFormValues = {
  eserviceFile: File | null
}

const defaultValues: EServiceImportVersionDocFormValues = {
  eserviceFile: null,
}

type ProviderEServiceImportVersionDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
}

export const ProviderEServiceImportVersionDrawer: React.FC<
  ProviderEServiceImportVersionDrawerProps
> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'list.drawers.importVersionDrawer' })
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()

  const formMethods = useForm({
    defaultValues,
  })

  const [isConfirmedImport, setIsConfirmedImport] = React.useState<boolean>(false)

  const handleChangeConfirmedImport = () => {
    setIsConfirmedImport((prev) => !prev)
  }

  const eserviceFile = formMethods.watch('eserviceFile')

  const { mutate: importVersion } = EServiceMutations.useImportVersion()

  const onSubmit = async (values: EServiceImportVersionDocFormValues) => {
    trackEvent('INTEROP_ESERVICE_UPLOAD_REQUEST', {})
    if (!values.eserviceFile || !isConfirmedImport) return

    importVersion(
      { eserviceFile: values.eserviceFile },
      {
        onSuccess: (res) => {
          trackEvent('INTEROP_ESERVICE_UPLOAD_RESPONSE_SUCCESS', {})
          onClose()
          navigate('PROVIDE_ESERVICE_SUMMARY', {
            params: {
              eserviceId: res.id,
              descriptorId: res.descriptorId,
            },
          })
        },
        onError: (error) => {
          if (isAxiosError(error) && error.response) {
            trackEvent('INTEROP_ESERVICE_UPLOAD_RESPONSE_ERROR', {
              errorCode: error.response.status,
            })
          }
        },
      }
    )
  }

  const handleCloseDrawer = () => {
    onClose()
  }

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onClose={handleCloseDrawer}
        title={t('title')}
        subtitle={
          <Trans
            components={{
              1: <Link underline="hover" href={importExportEServiceGuideLink} target="_blank" />,
            }}
          >
            {t('subtitle')}
          </Trans>
        }
        buttonAction={
          eserviceFile
            ? {
                label: tCommon('actions.import'),
                action: formMethods.handleSubmit(onSubmit),
                disabled: !isConfirmedImport,
                disabledTooltip: t('disabledImportTooltip'),
              }
            : undefined
        }
      >
        <Box component="form" noValidate>
          <RHFSingleFileInput
            sx={{ my: 0 }}
            name="eserviceFile"
            rules={{ required: true }}
            drawerStyle
          />

          {eserviceFile && (
            <Stack spacing={3} mt={4} mb={3}>
              <Typography variant="body2">{t('description')}</Typography>
              <InformationContainer
                label={t('attributeInfoSection.label')}
                content={t('attributeInfoSection.description')}
                direction={'column'}
              />
              <InformationContainer
                label={t('eserviceTitleInfoSection.label')}
                content={t('eserviceTitleInfoSection.description')}
                direction={'column'}
              />
              <InformationContainer
                label={t('structureInfoSection.label')}
                content={t('structureInfoSection.description')}
                direction={'column'}
              />
              <InformationContainer
                label={t('apiInterfaceInfoSection.label')}
                content={t('apiInterfaceInfoSection.description')}
                direction={'column'}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={isConfirmedImport}
                    onChange={handleChangeConfirmedImport}
                    inputProps={{ 'aria-label': t('confirmationField.ariaLabel') }}
                  />
                }
                label={t('confirmationField.label')}
                labelPlacement="end"
                componentsProps={{ typography: { variant: 'body2' } }}
              />
            </Stack>
          )}
        </Box>
      </Drawer>
    </FormProvider>
  )
}

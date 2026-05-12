import { SectionContainer } from '@/components/layout/containers'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { RHFCheckbox, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { asyncExchangeGuideLink } from '@/config/constants'
import { Alert, Link, Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { EServiceDownloads } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { UploadCallbackInterfaceDoc } from '../components/UploadCallbackInterfaceDoc'

type EServiceAsyncExchangeSectionProps = {
  areEServiceGeneralInfoEditable: boolean
}

export const EServiceAsyncExchangeSection: React.FC<EServiceAsyncExchangeSectionProps> = ({
  areEServiceGeneralInfoEditable,
}) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'create.step4.asyncExchangeSection',
  })

  const { descriptor } = useEServiceCreateContext()
  const { setValue } = useFormContext()
  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()

  const isSoap = descriptor?.eservice.technology === 'SOAP'

  React.useEffect(() => {
    if (isSoap) {
      setValue('asyncExchangeProperties.bulk', false)
    }
  }, [isSoap, setValue])

  const description = (
    <Trans
      components={{
        1: <Link href={asyncExchangeGuideLink} target="_blank" rel="noreferrer" />,
      }}
    >
      {t('description')}
    </Trans>
  )

  if (!areEServiceGeneralInfoEditable && descriptor) {
    const callback = descriptor.asyncExchangeCallbackInterface
    const props = descriptor.asyncExchangeProperties

    const handleDownloadCallback = () => {
      if (!callback) return
      downloadDocument(
        {
          eserviceId: descriptor.eservice.id,
          descriptorId: descriptor.id,
          documentId: callback.id,
        },
        getDownloadDocumentName(callback)
      )
    }

    return (
      <SectionContainer title={t('title')} description={description} sx={{ mt: 3 }}>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <InformationContainer
            label={t('callbackInterface.readOnlyLabel')}
            content={
              callback ? (
                <DocumentContainer
                  doc={callback}
                  onDownload={handleDownloadCallback}
                  size="small"
                />
              ) : (
                '-'
              )
            }
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            {t('configSubsection.title')}
          </Typography>
          <InformationContainer
            label={t('responseTimeField.label')}
            content={props?.responseTime?.toString() ?? '-'}
          />
          <InformationContainer
            label={t('maxResultSetField.label')}
            content={props?.maxResultSet?.toString() ?? '-'}
          />
          <InformationContainer
            label={t('resourceAvailableTimeField.label')}
            content={props?.resourceAvailableTime?.toString() ?? '-'}
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            {t('advancedSubsection.title')}
          </Typography>
          <InformationContainer
            label={t('confirmationField.label')}
            content={props?.confirmation ? 'Sì' : 'No'}
          />
          <InformationContainer label={t('bulkField.label')} content={props?.bulk ? 'Sì' : 'No'} />
        </Stack>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer title={t('title')} description={description} sx={{ mt: 3 }}>
      <Alert severity="warning" sx={{ mt: 2 }}>
        {t('editableInfoAlert')}
      </Alert>

      <UploadCallbackInterfaceDoc />

      <Typography variant="subtitle1" sx={{ mt: 3 }}>
        {t('configSubsection.title')}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
        <RHFTextField
          size="small"
          name="asyncExchangeProperties.responseTime"
          label={t('responseTimeField.label')}
          infoLabel={t('responseTimeField.infoLabel')}
          type="number"
          inputProps={{ min: 1 }}
          required
          rules={{ required: true, min: 1 }}
          sx={{ flex: 1, my: 0 }}
        />
        <RHFTextField
          size="small"
          name="asyncExchangeProperties.maxResultSet"
          label={t('maxResultSetField.label')}
          infoLabel={t('maxResultSetField.infoLabel')}
          type="number"
          inputProps={{ min: 1 }}
          required
          rules={{ required: true, min: 1 }}
          sx={{ flex: 1, my: 0 }}
        />
      </Stack>
      <RHFTextField
        size="small"
        name="asyncExchangeProperties.resourceAvailableTime"
        label={t('resourceAvailableTimeField.label')}
        infoLabel={t('resourceAvailableTimeField.infoLabel')}
        type="number"
        inputProps={{ min: 1 }}
        required
        rules={{ required: true, min: 1 }}
        sx={{ mt: 2, my: 0 }}
      />

      <Typography variant="subtitle1" sx={{ mt: 3 }}>
        {t('advancedSubsection.title')}
      </Typography>
      <Stack spacing={0} sx={{ mt: 1 }}>
        <RHFCheckbox
          name="asyncExchangeProperties.confirmation"
          label={t('confirmationField.label')}
          infoLabel={t('confirmationField.infoLabel')}
          sx={{ my: 0 }}
        />
        <RHFCheckbox
          name="asyncExchangeProperties.bulk"
          label={t('bulkField.label')}
          infoLabel={t('bulkField.infoLabel')}
          disabled={isSoap}
          sx={{ mb: 0 }}
        />
      </Stack>
    </SectionContainer>
  )
}

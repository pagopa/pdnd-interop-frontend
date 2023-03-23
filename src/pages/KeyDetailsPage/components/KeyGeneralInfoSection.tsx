import { ClientQueries } from '@/api/client'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { formatDateString } from '@/utils/format.utils'
import { Alert, Grid } from '@mui/material'
import { Stack } from '@mui/system'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

type KeyGeneralInfoSectionProps = {
  clientId: string
  kid: string
}

export const KeyGeneralInfoSection: React.FC<KeyGeneralInfoSectionProps> = ({ clientId, kid }) => {
  const { t } = useTranslation('key', { keyPrefix: 'edit.generalInformations' })
  const { data: publicKey } = ClientQueries.useGetSingleKey(clientId, kid)

  return (
    <Grid container>
      <Grid item xs={7}>
        <SectionContainer title={t('title')}>
          <Stack spacing={2}>
            <InformationContainer
              label={t('creationDateField.label')}
              content={publicKey ? formatDateString(publicKey.createdAt) : ''}
            />
            <InformationContainer
              label={t('uploaderField.label')}
              content={`${publicKey?.operator.name ?? ''} ${publicKey?.operator.familyName ?? ''}`}
            />
            <InformationContainer
              label={t('kidField.label')}
              content={publicKey?.keyId ?? ''}
              copyToClipboard={
                publicKey?.keyId
                  ? {
                      value: publicKey.keyId,
                      tooltipTitle: t('kidField.copySuccessFeedbackText'),
                    }
                  : undefined
              }
            />
            <InformationContainer
              label={t('clientIdField.label')}
              content={clientId}
              copyToClipboard={{
                value: clientId,
                tooltipTitle: t('clientIdField.copySuccessFeedbackText'),
              }}
            />
            {publicKey?.isOrphan && (
              <Alert severity="info">{t('operatorDeletedAlertMessage')}</Alert>
            )}
          </Stack>
        </SectionContainer>
      </Grid>
    </Grid>
  )
}

export const KeyGeneralInfoSectionSkeleton = () => {
  return (
    <Grid container>
      <Grid item xs={7}>
        <SectionContainerSkeleton height={227} />
      </Grid>
    </Grid>
  )
}

import { ClientQueries } from '@/api/client'
import {
  InformationContainer,
  SectionContainer,
  SectionContainerSkeleton,
} from '@/components/layout/containers'
import { InlineClipboard } from '@/components/shared/InlineClipboard'
import { formatDateString } from '@/utils/format.utils'
import { isKeyOrphan } from '@/utils/key.utils'
import { Alert } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'
import { useTranslation } from 'react-i18next'

type KeyGeneralInfoSectionProps = {
  clientId: string
  kid: string
}

export const KeyGeneralInfoSection: React.FC<KeyGeneralInfoSectionProps> = ({ clientId, kid }) => {
  const { t } = useTranslation('key', { keyPrefix: 'edit.generalInformations' })
  const { data: publicKey } = ClientQueries.useGetSingleKey(clientId, kid)
  const { data: operators } = ClientQueries.useGetOperatorsList(clientId)

  return (
    <SectionContainer>
      <SectionContainer.Title>{t('title')}</SectionContainer.Title>
      <SectionContainer.Content>
        <Stack spacing={2}>
          <InformationContainer label={t('creationDateField.label')}>
            {publicKey && formatDateString(publicKey.createdAt)}
          </InformationContainer>

          <InformationContainer label={t('uploaderField.label')}>
            {publicKey?.operator.name} {publicKey?.operator.familyName}
          </InformationContainer>

          <InformationContainer label={t('kidField.label')}>
            {publicKey?.key && (
              <InlineClipboard
                textToCopy={publicKey.key.kid}
                successFeedbackText={t('kidField.copySuccessFeedbackText')}
              />
            )}
          </InformationContainer>
          <InformationContainer label={t('clientIdField.label')}>
            <InlineClipboard
              textToCopy={clientId}
              successFeedbackText={t('clientIdField.copySuccessFeedbackText')}
            />
          </InformationContainer>

          {publicKey && isKeyOrphan(publicKey, operators) && (
            <Alert severity="info">{t('operatorDeletedAlertMessage')}</Alert>
          )}
        </Stack>
      </SectionContainer.Content>
    </SectionContainer>
  )
}

export const KeyGeneralInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton height={227} />
}

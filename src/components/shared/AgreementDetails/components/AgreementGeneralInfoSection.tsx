import { InformationContainer, SectionContainer } from '@/components/layout/containers'
import { RouterLink } from '@/router'
import { Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusChip } from '../../StatusChip'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'

export const AgreementGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.generalInformations' })
  const { agreement } = useAgreementDetailsContext()

  if (!agreement) return null

  return (
    <SectionContainer>
      <SectionContainer.Title>{t('title')}</SectionContainer.Title>
      <SectionContainer.Content>
        <Stack spacing={2}>
          <InformationContainer label={t('eserviceField.label')}>
            <RouterLink
              to="SUBSCRIBE_CATALOG_VIEW"
              params={{ eserviceId: agreement.eservice.id, descriptorId: agreement.descriptorId }}
              target="_blank"
            >
              {agreement.eservice.name}, {t('eserviceField.versionLabel')}{' '}
              {agreement.eservice.version}
            </RouterLink>
          </InformationContainer>
          <InformationContainer label={t('providerField.label')}>
            {agreement.producer.name}
          </InformationContainer>
          <InformationContainer label={t('requestStatusField.label')}>
            <Stack direction="row" spacing={1}>
              <StatusChip for="agreement" agreement={agreement} />
            </Stack>
          </InformationContainer>
        </Stack>
      </SectionContainer.Content>
    </SectionContainer>
  )
}

import {
  InformationContainer,
  SectionContainer,
  SectionContainerSkeleton,
} from '@/components/layout/containers'
import { RouterLink, useCurrentRoute } from '@/router'
import { Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusChip } from '../../StatusChip'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'

export const AgreementGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.generalInformations' })
  const { mode } = useCurrentRoute()
  const { agreement } = useAgreementDetailsContext()

  if (!agreement) return <AgreementGeneralInfoSectionSkeleton />

  return (
    <SectionContainer title={t('title')}>
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
        {mode === 'consumer' && (
          <InformationContainer label={t('providerField.label')}>
            {agreement?.producer.name}
          </InformationContainer>
        )}
        {mode === 'provider' && (
          <InformationContainer label={t('consumerField.label')}>
            {agreement?.consumer.name}
          </InformationContainer>
        )}
        <InformationContainer label={t('requestStatusField.label')}>
          <Stack direction="row" spacing={1}>
            <StatusChip for="agreement" agreement={agreement} />
          </Stack>
        </InformationContainer>
      </Stack>
    </SectionContainer>
  )
}

export const AgreementGeneralInfoSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={190} />
}

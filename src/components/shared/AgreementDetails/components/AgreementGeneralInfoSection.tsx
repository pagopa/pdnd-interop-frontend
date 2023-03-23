import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { RouterLink, useCurrentRoute } from '@/router'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusChip } from '../../StatusChip'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'

export const AgreementGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.generalInformations' })
  const { mode } = useCurrentRoute()
  const { agreement } = useAgreementDetailsContext()

  if (!agreement) return <AgreementGeneralInfoSectionSkeleton />

  const eServiceName = `${agreement.eservice.name}, ${t('eserviceField.versionLabel')} ${
    agreement.eservice.version
  }`

  return (
    <SectionContainer title={t('title')}>
      <Stack spacing={2}>
        <InformationContainer
          content={
            <RouterLink
              to="SUBSCRIBE_CATALOG_VIEW"
              params={{ eserviceId: agreement.eservice.id, descriptorId: agreement.descriptorId }}
              target="_blank"
            >
              {eServiceName}
            </RouterLink>
          }
          label={t('eserviceField.label')}
        />

        {mode === 'consumer' && (
          <InformationContainer
            content={agreement?.producer.name}
            label={t('providerField.label')}
          />
        )}
        {mode === 'provider' && (
          <InformationContainer
            content={agreement?.consumer.name}
            label={t('consumerField.label')}
          />
        )}
        <InformationContainer
          content={
            <Stack direction="row" spacing={1}>
              <StatusChip for="agreement" agreement={agreement} />
            </Stack>
          }
          label={t('requestStatusField.label')}
        />
      </Stack>
    </SectionContainer>
  )
}

export const AgreementGeneralInfoSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={190} />
}

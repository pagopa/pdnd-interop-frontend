import { EServiceQueries } from '@/api/eservice'
import { PurposeQueries } from '@/api/purpose'
import {
  InformationContainer,
  SectionContainer,
  SectionContainerSkeleton,
} from '@/components/layout/containers'
import { StatusChip } from '@/components/shared/StatusChip'
import { RouterLink } from '@/router'
import { formatThousands } from '@/utils/format.utils'
import { Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface PurposeDetailsGeneralInfoSectionProps {
  purposeId: string
}

export const PurposeDetailsGeneralInfoSection: React.FC<PurposeDetailsGeneralInfoSectionProps> = ({
  purposeId,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'view.sections.generalInformations' })
  const { data: purpose } = PurposeQueries.useGetSingle(purposeId)
  // This should not stay here, waiting to get the attributes from the purpose itself
  const { data: descriptor } = EServiceQueries.useGetDescriptorCatalog(
    purpose?.eservice.id as string,
    purpose?.eservice.descriptor.id as string,
    { enabled: !!(purpose?.eservice.id && purpose?.eservice.descriptor.id) }
  )

  if (!purpose || !descriptor) return null

  return (
    <SectionContainer title={t('title')}>
      <Stack spacing={2}>
        <InformationContainer label={t('eServiceField.label')}>
          <RouterLink
            target="_blank"
            to="SUBSCRIBE_CATALOG_VIEW"
            params={{
              eserviceId: purpose.eservice.id,
              descriptorId: purpose.eservice.descriptor.id,
            }}
          >
            {t('eServiceField.value', {
              name: purpose.eservice.name,
              version: purpose.eservice.descriptor.version,
            })}
          </RouterLink>
        </InformationContainer>
        <InformationContainer label={t('providerField.label')}>
          {purpose.eservice.producer.name}
        </InformationContainer>
        <InformationContainer label={t('purposeStatusField.label')}>
          <StatusChip for="purpose" purpose={purpose} />
        </InformationContainer>
        <InformationContainer label={t('agreementField.label')}>
          <RouterLink
            to="SUBSCRIBE_AGREEMENT_READ"
            params={{ agreementId: purpose.agreement.id }}
            target="_blank"
          >
            {t('agreementField.link.label')}
          </RouterLink>
        </InformationContainer>
        <InformationContainer label={t('dailyCallsEstimateField.label')}>
          {t('dailyCallsEstimateField.value', {
            value: formatThousands(purpose.currentVersion?.dailyCalls ?? 0),
          })}
        </InformationContainer>
        <InformationContainer label={t('consumerThreshold.label')}>
          {t('consumerThreshold.value', {
            value: formatThousands(descriptor.dailyCallsPerConsumer ?? 0),
          })}
        </InformationContainer>
        <InformationContainer label={t('totalThreshold.label')}>
          {t('totalThreshold.value', {
            value: formatThousands(descriptor.dailyCallsTotal ?? 0),
          })}
        </InformationContainer>
      </Stack>
    </SectionContainer>
  )
}

export const PurposeDetailsGeneralInfoSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={336} />
}

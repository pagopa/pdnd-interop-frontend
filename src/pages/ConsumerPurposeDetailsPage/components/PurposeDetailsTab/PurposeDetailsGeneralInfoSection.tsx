import type { Purpose } from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StatusChip } from '@/components/shared/StatusChip'
import { RouterLink } from '@/router'
import { formatThousands } from '@/utils/format.utils'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface PurposeDetailsGeneralInfoSectionProps {
  purpose: Purpose | undefined
}

export const PurposeDetailsGeneralInfoSection: React.FC<PurposeDetailsGeneralInfoSectionProps> = ({
  purpose,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'view.sections.generalInformations' })
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
        <InformationContainer
          label={t('eServiceField.label')}
          content={
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
          }
        />
        <InformationContainer
          label={t('providerField.label')}
          content={purpose.eservice.producer.name}
        />
        <InformationContainer
          label={t('purposeStatusField.label')}
          content={<StatusChip for="purpose" purpose={purpose} />}
        />
        <InformationContainer
          label={t('agreementField.label')}
          content={
            <RouterLink
              to="SUBSCRIBE_AGREEMENT_READ"
              params={{ agreementId: purpose.agreement.id }}
              target="_blank"
            >
              {t('agreementField.link.label')}
            </RouterLink>
          }
        />
        <InformationContainer
          label={t('dailyCallsEstimateField.label')}
          content={t('dailyCallsEstimateField.value', {
            value: formatThousands(purpose.currentVersion?.dailyCalls ?? 0),
          })}
        />
        <InformationContainer
          label={t('consumerThreshold.label')}
          content={t('consumerThreshold.value', {
            value: formatThousands(descriptor.dailyCallsPerConsumer ?? 0),
          })}
        />
        <InformationContainer
          label={t('totalThreshold.label')}
          content={t('totalThreshold.value', {
            value: formatThousands(descriptor.dailyCallsTotal ?? 0),
          })}
        />
      </Stack>
    </SectionContainer>
  )
}

export const PurposeDetailsGeneralInfoSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={336} />
}

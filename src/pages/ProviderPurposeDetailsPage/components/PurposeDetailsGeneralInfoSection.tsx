import { EServiceQueries } from '@/api/eservice'
import { PurposeQueries } from '@/api/purpose'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StatusChip } from '@/components/shared/StatusChip'
import { Link } from '@/router'
import { formatThousands } from '@/utils/format.utils'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
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
        <InformationContainer label={t('consumerField.label')} content={purpose.consumer.name} />

        <InformationContainer
          label={t('purposeStatusField.label')}
          content={<StatusChip for="purpose" purpose={purpose} />}
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
        <InformationContainer
          label={t('eServiceField.label')}
          content={
            <Link
              target="_blank"
              to="PROVIDE_ESERVICE_MANAGE"
              params={{
                eserviceId: purpose.eservice.id,
                descriptorId: purpose.eservice.descriptor.id,
              }}
            >
              {t('eServiceField.value', {
                name: purpose.eservice.name,
                version: purpose.eservice.descriptor.version,
              })}
            </Link>
          }
        />
        <InformationContainer
          label={t('agreementField.label')}
          content={
            <Link
              to="PROVIDE_AGREEMENT_READ"
              params={{ agreementId: purpose.agreement.id }}
              target="_blank"
            >
              {t('agreementField.link.label')}
            </Link>
          }
        />
      </Stack>
    </SectionContainer>
  )
}

export const PurposeDetailsGeneralInfoSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={336} />
}

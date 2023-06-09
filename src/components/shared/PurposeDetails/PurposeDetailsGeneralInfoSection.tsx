import React from 'react'
import type { Purpose } from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StatusChip } from '@/components/shared/StatusChip'
import { Link, useCurrentRoute } from '@/router'
import { formatThousands } from '@/utils/format.utils'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'

interface PurposeDetailsGeneralInfoSectionProps {
  purpose: Purpose
}

export const PurposeDetailsGeneralInfoSection: React.FC<PurposeDetailsGeneralInfoSectionProps> = ({
  purpose,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'view.sections.generalInformations' })
  const { mode } = useCurrentRoute()

  // This should not stay here, waiting to get the attributes from the purpose itself
  const { data: descriptor } = EServiceQueries.useGetDescriptorCatalog(
    purpose.eservice.id,
    purpose.eservice.descriptor.id
  )

  if (!descriptor) return null

  return (
    <SectionContainer title={t('title')}>
      <Stack spacing={2}>
        {mode === 'provider' && (
          <InformationContainer label={t('consumerField.label')} content={purpose.consumer.name} />
        )}

        {mode === 'consumer' && (
          <InformationContainer
            label={t('providerField.label')}
            content={purpose.eservice.producer.name}
          />
        )}

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
        <InformationContainer
          label={t('isFreeOfChargeField.label')}
          labelDescription={t('isFreeOfChargeField.labelDescription')}
          content={
            purpose.isFreeOfCharge ? t('isFreeOfChargeField.yes') : t('isFreeOfChargeField.no')
          }
        />

        {purpose.isFreeOfCharge && (
          <InformationContainer
            label={t('freeOfChargeReasonField.label')}
            content={purpose.freeOfChargeReason ?? ''}
          />
        )}
      </Stack>
    </SectionContainer>
  )
}

export const PurposeDetailsGeneralInfoSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={336} />
}

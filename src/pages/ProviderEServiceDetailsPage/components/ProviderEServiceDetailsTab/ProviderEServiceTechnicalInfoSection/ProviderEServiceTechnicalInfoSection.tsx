import { EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProviderEServiceThresholdsSection } from './ProviderEServiceThresholdsSection'
import { ProviderEServiceUsefulLinksSection } from './ProviderEServiceUsefulLinksSection'
import { ProviderEServiceDocumentationSection } from './ProviderEServiceDocumentationSection'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  FEATURE_FLAG_AGREEMENT_APPROVAL_POLICY_EDITABLE,
  FEATURE_FLAG_SIGNALHUB_WHITELIST,
  SIGNALHUB_WHITELIST_PRODUCER,
} from '@/config/env'
import { AuthHooks } from '@/api/auth'
import { formatDateString } from '@/utils/format.utils'
import { ProviderEServiceAgreementApprovalPolicySection } from './ProviderEServiceAgreementApprovalPolicySection'

export const ProviderEServiceTechnicalInfoSection: React.FC = () => {
  const producerId = AuthHooks.useJwt().jwt?.organizationId as string
  const isSignalHubFlagEnabled = FEATURE_FLAG_SIGNALHUB_WHITELIST
    ? SIGNALHUB_WHITELIST_PRODUCER.includes(producerId)
    : true

  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.technicalInformations',
  })

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        <SectionContainer innerSection>
          <Stack spacing={2}>
            <InformationContainer
              label={t('eserviceId.label')}
              content={eserviceId}
              copyToClipboard={{
                value: eserviceId,
                tooltipTitle: t('eserviceId.copySuccessFeedbackText'),
              }}
            />
            <InformationContainer
              label={t('descriptorId.label')}
              content={descriptor.id}
              copyToClipboard={{
                value: descriptor.id,
                tooltipTitle: t('descriptorId.copySuccessFeedbackText'),
              }}
            />
            {descriptor.publishedAt && (
              <InformationContainer
                label={t('publishedAt')}
                content={formatDateString(descriptor.publishedAt)}
              />
            )}
            {descriptor.suspendedAt && descriptor.state === 'SUSPENDED' && (
              <InformationContainer
                label={t('suspendedAt')}
                content={formatDateString(descriptor.suspendedAt)}
              />
            )}
            {descriptor.deprecatedAt && (
              <InformationContainer
                label={t('deprecatedAt')}
                content={formatDateString(descriptor.deprecatedAt)}
              />
            )}
            {descriptor.archivedAt && (
              <InformationContainer
                label={t('archivedAt')}
                content={formatDateString(descriptor.archivedAt)}
              />
            )}
            <InformationContainer
              label={t('technology')}
              content={descriptor.eservice.technology}
            />

            <InformationContainer label={t('audience')} content={descriptor.audience[0]} />

            <InformationContainer
              label={t('mode.label')}
              labelDescription={t('mode.labelDescription')}
              content={t(`mode.value.${descriptor.eservice.mode}`)}
            />
            {isSignalHubFlagEnabled && (
              <InformationContainer
                label={t('isSignalHubEnabled.label')}
                content={t(`isSignalHubEnabled.value.${descriptor.eservice.isSignalHubEnabled}`)}
              />
            )}
          </Stack>
        </SectionContainer>
        <Divider />
        <ProviderEServiceThresholdsSection descriptor={descriptor} />
        <Divider />
        {FEATURE_FLAG_AGREEMENT_APPROVAL_POLICY_EDITABLE && (
          <>
            <ProviderEServiceAgreementApprovalPolicySection descriptor={descriptor} />
            <Divider />
          </>
        )}
        <ProviderEServiceDocumentationSection descriptor={descriptor} />
        <Divider />
        <ProviderEServiceUsefulLinksSection />
      </Stack>
    </SectionContainer>
  )
}

export const ProviderEServiceTechnicalInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}

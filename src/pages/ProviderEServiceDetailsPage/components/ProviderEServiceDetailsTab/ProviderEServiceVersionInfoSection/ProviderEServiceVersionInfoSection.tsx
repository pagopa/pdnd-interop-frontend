import React from 'react'
import { Divider, Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useParams } from '@/router'
import { useDrawerState } from '@/hooks/useDrawerState'
import { formatDateString } from '@/utils/format.utils'
import { getLastDescriptor } from '@/utils/eservice.utils'
import { FEATURE_FLAG_AGREEMENT_APPROVAL_POLICY_UPDATE } from '@/config/env'
import { ProviderEServiceUpdateAgreementApprovalPolicyDrawer } from './ProviderEServiceUpdateAgreementApprovalPolicyDrawer'
import { AuthHooks } from '@/api/auth'

export const ProviderEServiceVersionInfoSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.versionInformations',
  })
  const { t: tCommon } = useTranslation('common')

  const { isViewer } = AuthHooks.useJwt()

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  const latestPublishedDescriptor = getLastDescriptor(
    descriptor.eservice.descriptors.filter(
      (d) => d.state !== 'DRAFT' && d.state !== 'WAITING_FOR_APPROVAL'
    )
  )

  const isViewingLatestVersion =
    latestPublishedDescriptor === undefined || latestPublishedDescriptor.id === descriptor.id

  const { data: latestDescriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, latestPublishedDescriptor?.id ?? descriptorId)
  )

  const {
    isOpen: isApprovalPolicyDrawerOpen,
    openDrawer: openApprovalPolicyDrawer,
    closeDrawer: closeApprovalPolicyDrawer,
  } = useDrawerState()

  return (
    <>
      <SectionContainer title={t('title')}>
        <Stack spacing={2}>
          <SectionContainer
            innerSection
            title={t('details.title')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
          >
            <InformationContainer
              label={t('details.descriptorDescription.label')}
              content={
                <Typography variant="body2" component="span">
                  {descriptor.description ?? ''}
                </Typography>
              }
            />
          </SectionContainer>
          {FEATURE_FLAG_AGREEMENT_APPROVAL_POLICY_UPDATE && (
            <>
              <Divider />
              <SectionContainer
                innerSection
                title={t('agreementApprovalPolicy.title')}
                titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
                topSideActions={
                  isViewer
                    ? []
                    : [
                        {
                          action: openApprovalPolicyDrawer,
                          label: tCommon('actions.edit'),
                          icon: EditIcon,
                        },
                      ]
                }
              >
                <InformationContainer
                  label={t('agreementApprovalPolicy.label')}
                  content={t(
                    `agreementApprovalPolicy.content.${descriptor.agreementApprovalPolicy}`
                  )}
                />
              </SectionContainer>
            </>
          )}
          <Divider />
          <SectionContainer
            innerSection
            title={t('lifeCycle.title')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
          >
            <Stack spacing={2}>
              {!isViewingLatestVersion && latestDescriptor.publishedAt && (
                <InformationContainer
                  label={t('lifeCycle.lastVersionDate')}
                  content={formatDateString(latestDescriptor.publishedAt)}
                />
              )}
              {descriptor.archivedAt && (
                <InformationContainer
                  label={t('lifeCycle.archivedDate')}
                  content={formatDateString(descriptor.archivedAt)}
                />
              )}
              {descriptor.suspendedAt && descriptor.state === 'SUSPENDED' && (
                <InformationContainer
                  label={t('lifeCycle.suspendedDate')}
                  content={formatDateString(descriptor.suspendedAt)}
                />
              )}
              {descriptor.deprecatedAt && (
                <InformationContainer
                  label={t('lifeCycle.deprecatedDate')}
                  content={formatDateString(descriptor.deprecatedAt)}
                />
              )}
              {descriptor.publishedAt && (
                <InformationContainer
                  label={t('lifeCycle.publishedDate')}
                  content={formatDateString(descriptor.publishedAt)}
                />
              )}
            </Stack>
          </SectionContainer>
        </Stack>
      </SectionContainer>
      <ProviderEServiceUpdateAgreementApprovalPolicyDrawer
        isOpen={isApprovalPolicyDrawerOpen}
        onClose={closeApprovalPolicyDrawer}
        descriptor={descriptor}
      />
    </>
  )
}

export const ProviderEServiceVersionInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}

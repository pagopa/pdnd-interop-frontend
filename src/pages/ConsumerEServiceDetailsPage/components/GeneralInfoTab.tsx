import { EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useParams } from '@/router'
import { formatDateStringNumeric } from '@/utils/format.utils'
import Launch from '@mui/icons-material/Launch'
import { Divider, Grid, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { MIButton as Button } from '@pagopa/mui-italia'
import { useSuspenseQuery, useQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { eserviceIntegrationGuideLink, checksumGuideLink } from '@/config/constants'

const GeneralInfoTab = () => {
  return (
    <Grid container>
      <Grid item xs={12} lg={8}>
        <React.Suspense fallback={<SectionContainerSkeleton sx={{ mt: 4 }} height={835} />}>
          <EServiceInformationsSection />
        </React.Suspense>
        <React.Suspense fallback={<SectionContainerSkeleton sx={{ mt: 4 }} height={510} />}>
          <VersionInformationsSection />
        </React.Suspense>
        <UsefulLinksSection />
      </Grid>
    </Grid>
  )
}

const EServiceInformationsSection = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'consumer.detail.generalInfo.eserviceInfo',
  })

  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  return (
    <SectionContainer title={t('title')}>
      <SectionContainer innerSection title={t('sections.details.title')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('sections.details.fields.name')}
            content={descriptor.eservice.name}
          />
          <InformationContainer
            label={t('sections.details.fields.description')}
            content={descriptor.eservice.description}
          />
          {descriptor.templateRef && (
            <InformationContainer
              label={t('sections.details.fields.template')}
              content={descriptor.templateRef?.templateName}
            />
          )}
          <InformationContainer
            label={t('sections.details.fields.producer')}
            content={descriptor.eservice.producer.name}
          />
          <Divider />
        </Stack>
      </SectionContainer>
      <SectionContainer innerSection title={t('sections.config.title')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('sections.config.fields.exchange.label')}
            content={t(
              `sections.config.fields.exchange.${descriptor.eservice.asyncExchange ? 'ASYNC' : 'SYNC'}`
            )}
          />
          <InformationContainer
            label={t('sections.config.fields.mode.label')}
            content={t(`sections.config.fields.mode.${descriptor.eservice.mode}`)}
          />
          <InformationContainer
            label={t(`sections.config.fields.personalData.${descriptor.eservice.mode}.label`)}
            content={t(
              `sections.config.fields.personalData.value.${descriptor.eservice.personalData ?? false}`
            )}
          />
          <Divider />
        </Stack>
      </SectionContainer>
      <SectionContainer innerSection title={t('sections.termsOfUse.title')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('sections.termsOfUse.fields.delegable.label')}
            labelDescription={t('sections.termsOfUse.fields.delegable.description')}
            content={t(
              `sections.termsOfUse.fields.delegable.value.${descriptor.eservice.isConsumerDelegable ?? false}`
            )}
          />

          <InformationContainer
            label={t('sections.termsOfUse.fields.dataAccessDelegable.label')}
            labelDescription={t('sections.termsOfUse.fields.dataAccessDelegable.description')}
            content={t(
              `sections.termsOfUse.fields.dataAccessDelegable.value.${descriptor.eservice.isClientAccessDelegable ?? false}`
            )}
          />
          <Divider />
        </Stack>
      </SectionContainer>
      <SectionContainer innerSection title={t('sections.contacts.title')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('sections.contacts.fields.email')}
            content={descriptor.eservice.mail?.address ?? ''}
          />

          <InformationContainer
            label={t('sections.contacts.fields.notes')}
            content={descriptor.eservice.mail?.description ?? ''}
          />
        </Stack>
      </SectionContainer>
    </SectionContainer>
  )
}

const VersionInformationsSection = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'consumer.detail.generalInfo.versionInfo',
  })

  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()

  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  const { data: activeDescriptor } = useQuery({
    ...EServiceQueries.getDescriptorCatalog(
      eserviceId,
      descriptor.eservice.activeDescriptor?.id ?? ''
    ),
    enabled: !!descriptor.eservice.activeDescriptor?.id,
  })

  return (
    <SectionContainer title={t('title')}>
      <SectionContainer innerSection title={t('sections.details.title')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('sections.details.fields.description')}
            content={descriptor.description ?? ''}
          />
          <Divider />
        </Stack>
      </SectionContainer>
      <SectionContainer innerSection title={t('sections.fruition.title')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('sections.fruition.fields.approval.label')}
            content={t(
              `sections.fruition.fields.approval.value.${descriptor.agreementApprovalPolicy ?? false}`
            )}
          />
        </Stack>
      </SectionContainer>
      <SectionContainer innerSection title={t('sections.lifecycle.title')}>
        <Stack spacing={2}>
          {activeDescriptor && activeDescriptor.publishedAt && (
            <InformationContainer
              label={t('sections.lifecycle.fields.lastVersionPublishedAt')}
              content={formatDateStringNumeric(activeDescriptor.publishedAt)}
            />
          )}
          {descriptor.archivedAt && (
            <InformationContainer
              label={t('sections.lifecycle.fields.archivedAt')}
              content={formatDateStringNumeric(descriptor.archivedAt)}
            />
          )}
          {descriptor.deprecatedAt && (
            <InformationContainer
              label={t('sections.lifecycle.fields.deprecatedAt')}
              content={formatDateStringNumeric(descriptor.deprecatedAt)}
            />
          )}
          {descriptor.suspendedAt && (
            <InformationContainer
              label={t('sections.lifecycle.fields.suspendedAt')}
              content={formatDateStringNumeric(descriptor.suspendedAt)}
            />
          )}
          {descriptor.publishedAt && (
            <InformationContainer
              label={t('sections.lifecycle.fields.publishedAt')}
              content={formatDateStringNumeric(descriptor.publishedAt)}
            />
          )}
        </Stack>
      </SectionContainer>
    </SectionContainer>
  )
}

const UsefulLinksSection = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'consumer.detail.generalInfo.usefulLinks',
  })

  return (
    <SectionContainer title={t('title')}>
      <Stack spacing={2} alignItems="start">
        <Button startIcon={<Launch />} variant="text" href={eserviceIntegrationGuideLink}>
          {t('integration')}
        </Button>

        <Button startIcon={<Launch />} variant="text" href={checksumGuideLink}>
          {t('checksum')}
        </Button>
      </Stack>
    </SectionContainer>
  )
}

export default GeneralInfoTab

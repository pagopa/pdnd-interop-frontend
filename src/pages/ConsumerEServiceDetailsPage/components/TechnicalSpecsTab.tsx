import { EServiceDownloads, EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Grid, Stack, Divider, useTheme } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { MIButton as Button } from '@pagopa/mui-italia'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import AttachFile from '@mui/icons-material/AttachFile'
import { secondsToMinutes } from 'date-fns'
import Launch from '@mui/icons-material/Launch'
import { IconLink } from '@/components/shared/IconLink'

const TechnicalSpecsTab = () => {
  return (
    <Grid container>
      <Grid item xs={12} lg={8}>
        <React.Suspense fallback={<SectionContainerSkeleton sx={{ mt: 4 }} height={1100} />}>
          <SpecsSection />
        </React.Suspense>
        <React.Suspense fallback={<SectionContainerSkeleton sx={{ mt: 4 }} height={150} />}>
          <SignalHubSection />
        </React.Suspense>
        <React.Suspense fallback={<SectionContainerSkeleton sx={{ mt: 4 }} height={190} />}>
          <DocumentationSection />
        </React.Suspense>
      </Grid>
    </Grid>
  )
}

const SpecsSection = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'consumer.detail.technicalSpecs.specs',
  })

  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()

  const download = React.useCallback(
    (document?: EServiceDoc) => {
      if (!document) return
      downloadDocument(
        {
          eserviceId: eserviceId,
          descriptorId: descriptorId,
          documentId: document.id,
        },
        getDownloadDocumentName(document)
      )
    },
    [descriptorId, eserviceId, downloadDocument]
  )

  return (
    <SectionContainer title={t('title')}>
      <SectionContainer innerSection title={t('sections.identifiers.title')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('sections.identifiers.fields.id')}
            content={descriptor.eservice.id}
          />
          <InformationContainer label={t('sections.identifiers.fields.keychain')} content={''} />
          <Divider />
        </Stack>
      </SectionContainer>
      <SectionContainer innerSection title={t('sections.interface.title')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('sections.interface.fields.interface')}
            content={
              <Button
                startIcon={<AttachFile />}
                variant="text"
                onClick={() => download(descriptor.interface)}
              >
                {descriptor.interface?.prettyName}
              </Button>
            }
          />
          <InformationContainer
            label={t('sections.interface.fields.checksum')}
            content={descriptor.interface?.checksum ?? ''}
          />
          <Divider />
        </Stack>
      </SectionContainer>
      <SectionContainer innerSection title={t('sections.voucher.title')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('sections.voucher.fields.lifespan.label')}
            content={t('sections.voucher.fields.lifespan.value', {
              count: secondsToMinutes(descriptor.voucherLifespan),
            })}
          />
          <InformationContainer
            label={t('sections.voucher.fields.audience')}
            content={descriptor.audience[0]}
          />
          <Divider />
        </Stack>
      </SectionContainer>
      <SectionContainer innerSection title={t('sections.others.title')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('sections.others.fields.approval.label')}
            content={t(
              `sections.others.fields.approval.value.${descriptor.agreementApprovalPolicy}`
            )}
          />
          <InformationContainer
            label={t('sections.others.fields.exchange.label')}
            content={t(
              `sections.others.fields.exchange.value.${descriptor.eservice.asyncExchange ? 'ASYNC' : 'SYNC'}`
            )}
          />
          <InformationContainer
            label={t('sections.others.fields.mode.label')}
            content={t(`sections.others.fields.mode.value.${descriptor.eservice.mode}`)}
          />
          <InformationContainer
            label={t('sections.others.fields.technology')}
            content={descriptor.eservice.technology}
          />
          {descriptor.eservice.asyncExchange && <Divider />}
        </Stack>
      </SectionContainer>
      {descriptor.eservice.asyncExchange && (
        <SectionContainer innerSection title={t('sections.asyncExchange.title')}>
          <Stack spacing={2}>
            <InformationContainer
              label={t('sections.asyncExchange.fields.interface')}
              content={
                <Button
                  startIcon={<AttachFile />}
                  variant="text"
                  onClick={() => download(descriptor.asyncExchangeCallbackInterface)}
                >
                  {descriptor.asyncExchangeCallbackInterface?.prettyName}
                </Button>
              }
            />
            <InformationContainer
              label={t('sections.asyncExchange.fields.responseTime.label')}
              content={t('sections.asyncExchange.fields.responseTime.value', {
                count: descriptor.asyncExchangeProperties?.responseTime,
              })}
            />
            <InformationContainer
              label={t('sections.asyncExchange.fields.maxResultSet')}
              content={descriptor.asyncExchangeProperties?.maxResultSet.toString() ?? ''}
            />
            <InformationContainer
              label={t('sections.asyncExchange.fields.resourceAvailableTime.label')}
              content={t('sections.asyncExchange.fields.resourceAvailableTime.value', {
                count: descriptor.asyncExchangeProperties?.resourceAvailableTime,
              })}
            />
            <InformationContainer
              label={t('sections.asyncExchange.fields.confirmation.label')}
              content={t(
                `sections.asyncExchange.fields.confirmation.value.${descriptor.asyncExchangeProperties?.confirmation ?? false}`
              )}
            />
            <InformationContainer
              label={t('sections.asyncExchange.fields.bulk.label')}
              content={t(
                `sections.asyncExchange.fields.bulk.value.${descriptor.asyncExchangeProperties?.confirmation ?? false}`
              )}
            />
            <Divider />
          </Stack>
        </SectionContainer>
      )}
    </SectionContainer>
  )
}

const SignalHubSection = () => {
  const theme = useTheme()
  const { t } = useTranslation('eservice', {
    keyPrefix: 'consumer.detail.technicalSpecs.signalHub',
  })

  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  return (
    <SectionContainer
      title={t('title')}
      description={
        <Trans
          t={t}
          i18nKey="description"
          components={{
            1: (
              <IconLink
                color={theme.colors.blue[500]}
                href={''}
                target="_blank"
                endIcon={<Launch fontSize="small" />}
              />
            ),
          }}
        />
      }
    >
      <Stack spacing={2}>
        <InformationContainer
          label={t('fields.enabled.label')}
          content={t(`fields.enabled.value.${descriptor.eservice.isSignalHubEnabled ?? false}`)}
        />
      </Stack>
    </SectionContainer>
  )
}

const DocumentationSection = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'consumer.detail.technicalSpecs.documentation',
  })

  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()

  const download = React.useCallback(
    (document?: EServiceDoc) => {
      if (!document) return
      downloadDocument(
        {
          eserviceId: eserviceId,
          descriptorId: descriptorId,
          documentId: document.id,
        },
        getDownloadDocumentName(document)
      )
    },
    [descriptorId, eserviceId, downloadDocument]
  )

  return (
    <SectionContainer title={t('title')}>
      <Stack spacing={2}>
        {descriptor.docs.map((doc) => (
          <InformationContainer
            key={doc.id}
            label={t('fields.document')}
            content={
              <Button startIcon={<AttachFile />} variant="text" onClick={() => download(doc)}>
                {doc.prettyName}
              </Button>
            }
          />
        ))}
      </Stack>
    </SectionContainer>
  )
}

export default TechnicalSpecsTab

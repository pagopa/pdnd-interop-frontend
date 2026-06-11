import React from 'react'
import type { CompactProducerKeychains, EServiceDoc } from '@/api/api.generatedTypes'
import { Divider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { IconLink } from '@/components/shared/IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { EServiceDownloads, EServiceQueries } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { secondsToMinutes } from '@/utils/format.utils'
import { SummaryInformationContainer } from '@/components/shared/SummaryInformationContainer'

type ProviderEServiceDocumentationSummarySectionProps = {
  associatedKeychains?: CompactProducerKeychains
}

export const ProviderEServiceDocumentationSummarySection: React.FC<
  ProviderEServiceDocumentationSummarySectionProps
> = ({ associatedKeychains }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'summary.documentationSummary' })
  const { t: tCommon } = useTranslation('common')
  const params = useParams<'PROVIDE_ESERVICE_SUMMARY'>()

  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(params.eserviceId, params.descriptorId)
  )

  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()
  const voucherLifespan = secondsToMinutes(descriptor.voucherLifespan)
  const isAsyncExchange = descriptor.eservice.asyncExchange

  const handleDownloadDocument = (document: EServiceDoc) => {
    downloadDocument(
      {
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        documentId: document.id,
      },
      getDownloadDocumentName(document)
    )
  }

  const asyncExchangeProperties = descriptor.asyncExchangeProperties

  const formatAsyncNumber = (value: number | undefined) => {
    return typeof value === 'number' ? String(value) : undefined
  }

  const formatAsyncSeconds = (value: number | undefined) => {
    return typeof value === 'number'
      ? `${value} ${tCommon('time.second', { count: value })}`
      : undefined
  }

  const formatAsyncBoolean = (value: boolean | undefined) => {
    return typeof value === 'boolean' ? t(`asyncExchange.booleanValue.${value}`) : undefined
  }

  const hiddenKeychainsCount = associatedKeychains
    ? associatedKeychains.pagination.totalCount - associatedKeychains.results.length
    : 0

  const keychainsContent = associatedKeychains?.results.length ? (
    <Stack spacing={1}>
      {associatedKeychains.results.map((keychain) => (
        <span key={keychain.id}>{keychain.name}</span>
      ))}
      {hiddenKeychainsCount > 0 && (
        <Typography component="span" variant="body2">
          {t('producerKeychains.moreLabel', { count: hiddenKeychainsCount })}
        </Typography>
      )}
    </Stack>
  ) : undefined

  return (
    <Stack spacing={2}>
      <SummaryInformationContainer
        label={t('interface.label')}
        content={
          descriptor.interface && (
            <IconLink
              component="button"
              startIcon={<AttachFileIcon fontSize="small" />}
              onClick={handleDownloadDocument.bind(null, descriptor.interface)}
            >
              {descriptor.interface.prettyName}
            </IconLink>
          )
        }
      />
      <SummaryInformationContainer label={t('audience.label')} content={descriptor.audience[0]} />
      <SummaryInformationContainer
        label={t('voucherLifespan.label')}
        content={`${voucherLifespan} ${tCommon('time.minute', {
          count: voucherLifespan,
        })}`}
      />
      {isAsyncExchange && (
        <>
          <Divider />
          <SummaryInformationContainer
            label={t('callbackInterface.label')}
            content={
              descriptor.asyncExchangeCallbackInterface ? (
                <IconLink
                  component="button"
                  startIcon={<AttachFileIcon fontSize="small" />}
                  onClick={handleDownloadDocument.bind(
                    null,
                    descriptor.asyncExchangeCallbackInterface
                  )}
                >
                  {descriptor.asyncExchangeCallbackInterface.prettyName}
                </IconLink>
              ) : undefined
            }
          />
          <SummaryInformationContainer
            label={t('asyncExchange.responseTime.label')}
            content={formatAsyncSeconds(asyncExchangeProperties?.responseTime)}
          />
          <SummaryInformationContainer
            label={t('asyncExchange.resourceAvailableTime.label')}
            content={formatAsyncSeconds(asyncExchangeProperties?.resourceAvailableTime)}
          />
          <SummaryInformationContainer
            label={t('asyncExchange.maxResultSet.label')}
            content={formatAsyncNumber(asyncExchangeProperties?.maxResultSet)}
          />
          <SummaryInformationContainer
            label={t('asyncExchange.confirmation.label')}
            content={formatAsyncBoolean(asyncExchangeProperties?.confirmation)}
          />
          <SummaryInformationContainer
            label={t('asyncExchange.bulk.label')}
            content={formatAsyncBoolean(asyncExchangeProperties?.bulk)}
          />
          <Divider />
          <SummaryInformationContainer
            label={t('producerKeychains.label')}
            content={keychainsContent}
          />
        </>
      )}
    </Stack>
  )
}

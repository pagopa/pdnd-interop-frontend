import React from 'react'
import { Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { secondsToMinutes } from '@/utils/format.utils'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { EServiceTemplateDownloads } from '@/api/eserviceTemplate/eserviceTemplate.downloads'
import { IconLink } from '@/components/shared/IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { EServiceDoc } from '@/api/api.generatedTypes'

export const ProviderEServiceTemplateTechnicalSpecsSummarySection: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'summary.technicalSpecsSummary',
  })
  const { t: tSummary } = useTranslation('eserviceTemplate', { keyPrefix: 'summary' })
  const { t: tCommon } = useTranslation('common')
  const params = useParams<'PROVIDE_ESERVICE_TEMPLATE_SUMMARY'>()

  const { data: eserviceTemplate } = useSuspenseQuery(
    EServiceTemplateQueries.getSingle(params.eServiceTemplateId, params.eServiceTemplateVersionId)
  )

  const downloadDocument = EServiceTemplateDownloads.useDownloadVersionDocument()
  const voucherLifespan = secondsToMinutes(eserviceTemplate.voucherLifespan)

  const asyncExchangeProperties = eserviceTemplate.asyncExchangeProperties

  const handleDownloadDocument = (document: EServiceDoc) => {
    downloadDocument(
      {
        eServiceTemplateId: eserviceTemplate.eserviceTemplate.id,
        eServiceTemplateVersionId: eserviceTemplate.id,
        documentId: document.id,
      },
      getDownloadDocumentName(document)
    )
  }

  const renderMissingField = () => (
    <Stack direction="row" alignItems="center" spacing={1}>
      <WarningAmberIcon color="warning" fontSize="small" />
      <Typography fontWeight={600}>{tSummary('missingField')}</Typography>
    </Stack>
  )

  const renderDocumentLink = (document: EServiceDoc) => (
    <IconLink
      component="button"
      startIcon={<AttachFileIcon fontSize="small" />}
      onClick={handleDownloadDocument.bind(null, document)}
    >
      {document.prettyName}
    </IconLink>
  )

  return (
    <Stack spacing={2}>
      <InformationContainer
        label={t('interface.label')}
        content={
          eserviceTemplate.interface
            ? renderDocumentLink(eserviceTemplate.interface)
            : renderMissingField()
        }
      />
      <InformationContainer
        label={t('voucherLifespan.label')}
        content={
          !eserviceTemplate.voucherLifespan
            ? renderMissingField()
            : `${voucherLifespan} ${tCommon('time.minute', {
                count: voucherLifespan,
              })}`
        }
      />
      {eserviceTemplate.eserviceTemplate.asyncExchange && (
        <>
          <InformationContainer
            label={t('callbackInterface.label')}
            content={
              eserviceTemplate.asyncExchangeCallbackInterface
                ? renderDocumentLink(eserviceTemplate.asyncExchangeCallbackInterface)
                : renderMissingField()
            }
          />
          <InformationContainer
            label={t('asyncExchange.responseTime.label')}
            content={
              asyncExchangeProperties
                ? `${asyncExchangeProperties.responseTime} ${tCommon('time.second', {
                    count: asyncExchangeProperties.responseTime,
                  })}`
                : renderMissingField()
            }
          />
          <InformationContainer
            label={t('asyncExchange.resourceAvailableTime.label')}
            content={
              asyncExchangeProperties
                ? `${asyncExchangeProperties.resourceAvailableTime} ${tCommon('time.second', {
                    count: asyncExchangeProperties.resourceAvailableTime,
                  })}`
                : renderMissingField()
            }
          />
          <InformationContainer
            label={t('asyncExchange.maxResultSet.label')}
            content={
              asyncExchangeProperties
                ? String(asyncExchangeProperties.maxResultSet)
                : renderMissingField()
            }
          />
          <InformationContainer
            label={t('asyncExchange.confirmation.label')}
            content={
              asyncExchangeProperties
                ? t(`asyncExchange.booleanValue.${asyncExchangeProperties.confirmation}`)
                : renderMissingField()
            }
          />
          <InformationContainer
            label={t('asyncExchange.bulk.label')}
            content={
              asyncExchangeProperties
                ? t(`asyncExchange.booleanValue.${asyncExchangeProperties.bulk}`)
                : renderMissingField()
            }
          />
        </>
      )}
    </Stack>
  )
}

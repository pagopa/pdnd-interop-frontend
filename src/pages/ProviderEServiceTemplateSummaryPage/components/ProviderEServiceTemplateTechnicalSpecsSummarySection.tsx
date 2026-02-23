import React from 'react'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { secondsToMinutes } from '@/utils/format.utils'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { EServiceTemplateDownloads } from '@/api/eserviceTemplate/eserviceTemplate.downloads'
import { IconLink } from '@/components/shared/IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { getDownloadDocumentName } from '@/utils/eservice.utils'

export const ProviderEServiceTemplateTechnicalSpecsSummarySection: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'summary.technicalSpecsSummary',
  })
  const { t: tCommon } = useTranslation('common')
  const params = useParams<'PROVIDE_ESERVICE_TEMPLATE_SUMMARY'>()

  const { data: eserviceTemplate } = useSuspenseQuery(
    EServiceTemplateQueries.getSingle(params.eServiceTemplateId, params.eServiceTemplateVersionId)
  )

  const downloadDocument = EServiceTemplateDownloads.useDownloadVersionDocument()
  const voucherLifespan = secondsToMinutes(eserviceTemplate.voucherLifespan)

  const handleDownloadInterface = () => {
    if (!eserviceTemplate.interface) return
    downloadDocument(
      {
        eServiceTemplateId: eserviceTemplate.eserviceTemplate.id,
        eServiceTemplateVersionId: eserviceTemplate.id,
        documentId: eserviceTemplate.interface.id,
      },
      getDownloadDocumentName(eserviceTemplate.interface)
    )
  }

  return (
    <Stack spacing={2}>
      {eserviceTemplate.interface && (
        <InformationContainer
          label={t('interface.label')}
          content={
            <IconLink
              component="button"
              startIcon={<AttachFileIcon fontSize="small" />}
              onClick={handleDownloadInterface}
            >
              {eserviceTemplate.interface.prettyName}
            </IconLink>
          }
        />
      )}
      <InformationContainer
        label={t('voucherLifespan.label')}
        content={`${voucherLifespan} ${tCommon('time.minute', {
          count: voucherLifespan,
        })}`}
      />
    </Stack>
  )
}

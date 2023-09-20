import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Link, useCurrentRoute } from '@/router'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusChip } from '../../StatusChip'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'
import { IconLink } from '../../IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { AgreementDownloads } from '@/api/agreement'
import FolderIcon from '@mui/icons-material/Folder'

export const AgreementSummarySection: React.FC = () => {
  const { mode } = useCurrentRoute()
  const { t } = useTranslation('agreement', { keyPrefix: 'read.summary' })
  const { agreement, openAttachedDocsDrawer } = useAgreementDetailsContext()
  const downloadContract = AgreementDownloads.useDownloadContract()

  if (!agreement) return <AgreementSummarySectionSkeleton />

  const handleDownloadDocument = () => {
    downloadContract({ agreementId: agreement.id }, `${t('documentationField.docLabel')}.pdf`)
  }

  const eserviceName = `${agreement.eservice.name}, ${t('eserviceField.versionLabel')} ${
    agreement.eservice.version
  }`

  return (
    <SectionContainer
      newDesign
      title={t('title')}
      bottomActions={[
        {
          onClick: openAttachedDocsDrawer,
          component: 'button',
          startIcon: <FolderIcon />,
          label: t('attachedDocsButtonLabel'),
        },
      ]}
    >
      <Stack spacing={2}>
        <InformationContainer
          content={
            <Link
              to="SUBSCRIBE_CATALOG_VIEW"
              params={{ eserviceId: agreement.eservice.id, descriptorId: agreement.descriptorId }}
              target="_blank"
            >
              {eserviceName}
            </Link>
          }
          label={t('eserviceField.label')}
        />

        <InformationContainer
          content={
            <Stack direction="row" spacing={1}>
              <StatusChip for="agreement" agreement={agreement} />
            </Stack>
          }
          label={t('requestStatusField.label')}
        />

        {mode === 'consumer' && (
          <InformationContainer
            content={agreement?.producer.name}
            label={t('providerField.label')}
          />
        )}

        {mode === 'provider' && (
          <InformationContainer
            content={agreement?.consumer.name}
            label={t('consumerField.label')}
          />
        )}

        {agreement.isContractPresent && (
          <InformationContainer
            content={
              <IconLink
                onClick={handleDownloadDocument}
                component="button"
                startIcon={<AttachFileIcon />}
              >
                {t('documentationField.docLabel')}
              </IconLink>
            }
            label={t('documentationField.label')}
          />
        )}
      </Stack>
    </SectionContainer>
  )
}

export const AgreementSummarySectionSkeleton: React.FC = () => {
  const height = 322

  return <SectionContainerSkeleton height={height} />
}

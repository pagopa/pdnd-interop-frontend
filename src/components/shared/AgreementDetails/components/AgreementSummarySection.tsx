import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Link, useCurrentRoute } from '@/router'
import { Box, Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusChip } from '../../StatusChip'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'
import { IconLink } from '../../IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { AgreementDownloads } from '@/api/agreement'
import FolderIcon from '@mui/icons-material/Folder'
import RuleIcon from '@mui/icons-material/Rule'

type AgreementSummarySectionProps = {
  onOpenCertifiedAttributesDrawer?: VoidFunction
}

export const AgreementSummarySection: React.FC<AgreementSummarySectionProps> = ({
  onOpenCertifiedAttributesDrawer,
}) => {
  const { mode, routeKey } = useCurrentRoute()
  const { t } = useTranslation('agreement', {
    keyPrefix:
      routeKey === 'SUBSCRIBE_AGREEMENT_EDIT' ? 'edit.generalInformations' : 'read.summary',
  })
  const { agreement, openAttachedDocsDrawer } = useAgreementDetailsContext()
  const downloadContract = AgreementDownloads.useDownloadContract()

  if (!agreement) return <AgreementSummarySectionSkeleton />

  const handleDownloadDocument = () => {
    downloadContract({ agreementId: agreement.id }, `${t('documentationField.docLabel')}.pdf`)
  }

  const eServiceName = `${agreement.eservice.name}, ${t('eserviceField.versionLabel')} ${
    agreement.eservice.version
  }`

  return (
    <SectionContainer newDesign title={t('title')}>
      <Stack spacing={2}>
        <InformationContainer
          content={
            <Link
              to="SUBSCRIBE_CATALOG_VIEW"
              params={{ eserviceId: agreement.eservice.id, descriptorId: agreement.descriptorId }}
              target="_blank"
            >
              {eServiceName}
            </Link>
          }
          label={t('eserviceField.label')}
        />

        {routeKey !== 'SUBSCRIBE_AGREEMENT_EDIT' && (
          <InformationContainer
            content={
              <Stack direction="row" spacing={1}>
                <StatusChip for="agreement" agreement={agreement} />
              </Stack>
            }
            label={t('requestStatusField.label')}
          />
        )}

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

        {routeKey !== 'SUBSCRIBE_AGREEMENT_EDIT' && (
          <>
            <Divider />

            <Box>
              <IconLink
                onClick={openAttachedDocsDrawer}
                component="button"
                startIcon={<FolderIcon />}
              >
                {t('attachedDocsButtonLabel')}
              </IconLink>
            </Box>
          </>
        )}

        {routeKey === 'SUBSCRIBE_AGREEMENT_EDIT' && (
          <>
            <Divider />

            <Box>
              <IconLink
                onClick={onOpenCertifiedAttributesDrawer}
                component="button"
                startIcon={<RuleIcon />}
              >
                {t('certifiedAttributesDrawerBtn')}
              </IconLink>
            </Box>
          </>
        )}
      </Stack>
    </SectionContainer>
  )
}

export const AgreementSummarySectionSkeleton: React.FC = () => {
  const { routeKey } = useCurrentRoute()
  const height = routeKey === 'SUBSCRIBE_AGREEMENT_EDIT' ? 194 : 322

  return <SectionContainerSkeleton height={height} />
}

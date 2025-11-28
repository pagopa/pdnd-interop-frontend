import type { Purpose } from '@/api/api.generatedTypes'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Link, useGeneratePath } from '@/router'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import LinkIcon from '@mui/icons-material/Link'
import { PurposeDownloads } from '@/api/purpose'
import { useTranslation } from 'react-i18next'
import DownloadIcon from '@mui/icons-material/Download'
import { FEATURE_FLAG_USE_SIGNED_DOCUMENT } from '@/config/env'

type ProviderPurposeDetailsGeneralInfoSectionProps = {
  purpose: Purpose
}

export const ProviderPurposeDetailsGeneralInfoSection: React.FC<
  ProviderPurposeDetailsGeneralInfoSectionProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'providerView.sections.generalInformations',
  })

  const { t: tShared } = useTranslation('shared-components', { keyPrefix: 'documents' })

  const generatePath = useGeneratePath()

  const downloadSignedRiskAnalysis = PurposeDownloads.useDownloadSignedRiskAnalysis()
  const downloadRiskAnalysis = PurposeDownloads.useDownloadRiskAnalysis()

  const handleDownloadSignedDocument = () => {
    if (!purpose.currentVersion || !purpose.currentVersion.riskAnalysisDocument) return
    downloadSignedRiskAnalysis(
      {
        purposeId: purpose.id,
        versionId: purpose.currentVersion.id,
        signedContractId: purpose.currentVersion.riskAnalysisDocument.id,
      },
      `${t('riskAnalysis.fileName')}.pdf`
    )
  }

  const handleDownloadDocument = () => {
    if (!purpose.currentVersion || !purpose.currentVersion.riskAnalysisDocument) return
    downloadRiskAnalysis(
      {
        purposeId: purpose.id,
        versionId: purpose.currentVersion.id,
        documentId: purpose.currentVersion.riskAnalysisDocument?.id,
      },
      `${t('riskAnalysis.fileName')}.pdf`
    )
  }

  const downloadRiskAnalysisDocumentAction = {
    label: t('riskAnalysis.link.label'),
    component: 'button',
    type: 'button',
    disabled: purpose.isDocumentReady === false,
    onClick: FEATURE_FLAG_USE_SIGNED_DOCUMENT
      ? handleDownloadSignedDocument
      : handleDownloadDocument,
    tooltip: purpose.isDocumentReady === false ? tShared('notAvailableYet') : undefined,
    startIcon: <DownloadIcon fontSize="small" />,
  }

  return (
    <SectionContainer
      title={t('title')}
      bottomActions={[
        ...(!purpose.currentVersion || !purpose.currentVersion.riskAnalysisDocument
          ? []
          : [downloadRiskAnalysisDocumentAction]),
        {
          label: t('agreementLink.label'),
          href:
            '/ui' + generatePath('PROVIDE_AGREEMENT_READ', { agreementId: purpose.agreement.id }),
          startIcon: <LinkIcon fontSize="small" />,
        },
      ]}
    >
      <Stack spacing={2}>
        <InformationContainer
          label={t('eServiceField.label')}
          content={
            <Link
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
        {purpose.purposeTemplate && (
          <InformationContainer
            label={t('purposeTemplateField.label')}
            content={
              <Link
                to="SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS"
                params={{
                  purposeTemplateId: purpose.purposeTemplate.id,
                }}
              >
                {purpose.purposeTemplate.purposeTitle}
              </Link>
            }
          />
        )}
        <InformationContainer label={t('consumerField.label')} content={purpose.consumer.name} />
        <InformationContainer
          label={t('descriptionField.label')}
          direction="column"
          content={purpose.description}
        />
      </Stack>
    </SectionContainer>
  )
}

export const ProviderPurposeDetailsGeneralInfoSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={317} />
}

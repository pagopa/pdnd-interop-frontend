import type { Purpose } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { Link, useGeneratePath } from '@/router'
import { Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import LinkIcon from '@mui/icons-material/Link'
import { PurposeDownloads } from '@/api/purpose'
import { useTranslation } from 'react-i18next'
import { IconLink } from '@/components/shared/IconLink'
import DownloadIcon from '@mui/icons-material/Download'

type ConsumerPurposeDetailsGeneralInfoSectionProps = {
  purpose: Purpose
}

export const ConsumerPurposeDetailsGeneralInfoSection: React.FC<
  ConsumerPurposeDetailsGeneralInfoSectionProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'consumerView.sections.generalInformations',
  })

  const generatePath = useGeneratePath()

  const downloadRiskAnalysis = PurposeDownloads.useDownloadRiskAnalysis()

  const handleDownloadDocument = () => {
    if (!purpose.currentVersion || !purpose.currentVersion.riskAnalysisDocument) return
    downloadRiskAnalysis(
      {
        purposeId: purpose.id,
        versionId: purpose.currentVersion.id,
        documentId: purpose.currentVersion.riskAnalysisDocument.id,
      },
      `${t('riskAnalysis.fileName')}.pdf`
    )
  }

  return (
    <SectionContainer title={t('title')} newDesign>
      <Stack spacing={2}>
        <InformationContainer
          label={t('eServiceField.label')}
          content={
            <Link
              to="SUBSCRIBE_CATALOG_VIEW"
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
        <InformationContainer
          label={t('providerField.label')}
          content={purpose.eservice.producer.name}
        />
        <InformationContainer
          label={t('descriptionField.label')}
          direction="column"
          content={purpose.description}
        />
        <Divider />
        <IconLink
          onClick={handleDownloadDocument}
          component="button"
          startIcon={<DownloadIcon />}
          alignSelf="start"
        >
          {t('riskAnalysis.link.label')}
        </IconLink>
        <IconLink
          href={
            '/ui' + generatePath('SUBSCRIBE_AGREEMENT_READ', { agreementId: purpose.agreement.id })
          }
          startIcon={<LinkIcon />}
          alignSelf="start"
        >
          {t('agreementLink.label')}
        </IconLink>
      </Stack>
    </SectionContainer>
  )
}

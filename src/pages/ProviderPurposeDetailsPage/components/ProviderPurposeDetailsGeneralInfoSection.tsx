import type { Purpose } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { useNavigate } from '@/router'
import { Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import LinkIcon from '@mui/icons-material/Link'
import { PurposeDownloads } from '@/api/purpose'
import { useTranslation } from 'react-i18next'
import { IconLink } from '@/components/shared/IconLink'
import DownloadIcon from '@mui/icons-material/Download'

type ProviderPurposeDetailsGeneralInfoSectionProps = {
  purpose: Purpose
}

export const ProviderPurposeDetailsGeneralInfoSection: React.FC<
  ProviderPurposeDetailsGeneralInfoSectionProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'providerView.sections.generalInformations',
  })

  const navigate = useNavigate()

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
          content={t('eServiceField.value', {
            name: purpose.eservice.name,
            version: purpose.eservice.descriptor.version,
          })}
        />
        <InformationContainer label={t('consumerField.label')} content={purpose.consumer.name} />
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
          onClick={() =>
            navigate('PROVIDE_AGREEMENT_READ', { params: { agreementId: purpose.agreement.id } })
          }
          component="button"
          startIcon={<LinkIcon />}
          alignSelf="start"
        >
          {t('agreementLink.label')}
        </IconLink>
      </Stack>
    </SectionContainer>
  )
}

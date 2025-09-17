import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Divider, Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import type { PurposeTemplate } from '@/api/purposeTemplate/mockedResponses'
import DownloadIcon from '@mui/icons-material/Download'

type PurposeTemplateGeneralInfoSectionProps = {
  purposeTemplate: PurposeTemplate
}
export const PurposeTemplateGeneralInfoSection: React.FC<
  PurposeTemplateGeneralInfoSectionProps
> = ({ purposeTemplate }) => {
  const { t } = useTranslation('purposeTemplate', {
    keyPrefix: 'read.detailsTab.sections.generalInformation',
  })

  const handleDownloadRiskAnalysis = () => {
    console.log('TODO: ADD API CALLS WHEN AVAILABLE')
  }

  const downloadRiskAnalysisAction = {
    startIcon: <DownloadIcon fontSize="small" />,
    component: 'button',
    onClick: handleDownloadRiskAnalysis,
    label: t('riskAnalysisDownloadLink'),
    sx: { fontWeight: 700 },
  }

  return (
    <>
      <SectionContainer title={t('title')} bottomActions={[downloadRiskAnalysisAction]}>
        <Stack spacing={2}>
          <InformationContainer label={t('producerName')} content={purposeTemplate.creatorId} />
          {/* TO DO: PUT CREATOR NAME WHEN AVAILABLE */}
          <InformationContainer
            label={t('tenantKind')}
            content={purposeTemplate.targetTenantKind}
          />
          <SectionContainer
            innerSection
            title={t('intendedTarget')}
            titleTypographyProps={{ variant: 'body2' }}
            sx={{ mb: 0 }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, mt: -2 }}>
              {/**TO DO: TO FIX NEGATIVE MARGIN */}
              {purposeTemplate.targetDescription}
            </Typography>
          </SectionContainer>
          <SectionContainer
            innerSection
            title={t('purposeDescription')}
            titleTypographyProps={{ variant: 'body2' }}
            sx={{ mb: 0 }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, mt: -2 }}>
              {purposeTemplate.purposeDescription}
            </Typography>
          </SectionContainer>
        </Stack>
      </SectionContainer>
    </>
  )
}

export const PurposeTemplateGeneralInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}

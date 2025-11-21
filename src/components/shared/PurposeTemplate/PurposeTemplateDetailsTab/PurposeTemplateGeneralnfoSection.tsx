import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'

type PurposeTemplateGeneralInfoSectionProps = {
  purposeTemplate: PurposeTemplateWithCompactCreator
}
export const PurposeTemplateGeneralInfoSection: React.FC<
  PurposeTemplateGeneralInfoSectionProps
> = ({ purposeTemplate }) => {
  const { t } = useTranslation('purposeTemplate', {
    keyPrefix: 'read.detailsTab.sections.generalInformation',
  })

  /** Availabilty about download of risk analysis of template will be available on the future  */

  // const handleDownloadRiskAnalysis = () => {
  //   console.log('TODO: ADD API CALLS WHEN AVAILABLE') // todo: add api calls when available
  // }

  // const downloadRiskAnalysisAction = {
  //   startIcon: <DownloadIcon fontSize="small" />,
  //   component: 'button',
  //   onClick: handleDownloadRiskAnalysis,
  //   label: t('riskAnalysisDownloadLink'),
  //   sx: { fontWeight: 700 },
  // }

  const tenantKindTranslationKey =
    purposeTemplate.targetTenantKind === 'PA'
      ? t('tenantKindValues.labelPA')
      : t('tenantKindValues.labelNotPA')

  return (
    <>
      <SectionContainer title={t('title')} bottomActions={[]}>
        <Stack spacing={2}>
          <InformationContainer label={t('producerName')} content={purposeTemplate.creator.name} />
          <InformationContainer label={t('tenantKind')} content={tenantKindTranslationKey} />
          <InformationContainer
            label={t('handlesPersonalDataLabel')}
            content={purposeTemplate.handlesPersonalData ? t('yes') : t('no')}
          />
          <SectionContainer
            innerSection
            title={t('intendedTarget')}
            titleTypographyProps={{ variant: 'body2' }}
            sx={{ mb: 0 }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, mt: -2 }}>
              {/* TODO: TO FIX NEGATIVE MARGIN */}
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

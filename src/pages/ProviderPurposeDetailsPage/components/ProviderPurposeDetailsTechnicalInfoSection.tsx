import type { Purpose } from '@/api/api.generatedTypes'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ProviderPurposeDetailsTechnicalInfoSectionProps = {
  purpose: Purpose
}

export const ProviderPurposeDetailsTechnicalInfoSection: React.FC<
  ProviderPurposeDetailsTechnicalInfoSectionProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'providerView.sections.technicalInformations',
  })

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        <InformationContainer
          label={t('purposeField.label')}
          content={purpose.id}
          copyToClipboard={{
            value: purpose.id,
            tooltipTitle: t('purposeField.copySuccessFeedbackText'),
          }}
        />
        <InformationContainer
          label={t('consumerField.label')}
          content={purpose.consumer.id}
          copyToClipboard={{
            value: purpose.consumer.id,
            tooltipTitle: t('consumerField.copySuccessFeedbackText'),
          }}
        />
        {purpose.purposeTemplate && (
          <InformationContainer
            label={t('purposeTemplateField.label')}
            content={purpose.consumer.id}
            copyToClipboard={{
              value: purpose.consumer.id,
              tooltipTitle: t('purposeTemplateField.copySuccessFeedbackText'),
            }}
          />
        )}
      </Stack>
    </SectionContainer>
  )
}

export const ProviderPurposeDetailsTechnicalInfoSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={317} />
}

import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSuspenseQuery } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { SectionContainer } from '@/components/layout/containers'

type PurposeTemplateTemplateSummaryGeneralInformationAccordionProps = {
  purposeTemplateId: string
}

export const PurposeTemplateTemplateSummaryGeneralInformationAccordion: React.FC<
  PurposeTemplateTemplateSummaryGeneralInformationAccordionProps
> = ({ purposeTemplateId }) => {
  const { data: purposeTemplate } = useSuspenseQuery(
    PurposeTemplateQueries.getSingle(purposeTemplateId)
  )
  const { t } = useTranslation('purposeTemplate', {
    keyPrefix: 'edit.summary.generalInformationSection',
  })

  const suggestedApiCalls = (purposeTemplate.purposeDailyCalls ?? '-') as unknown as string

  return (
    <Stack spacing={3}>
      <SectionContainer innerSection title={t('descriptionTitle')}>
        <Stack spacing={2}>
          <InformationContainer
            content={purposeTemplate.purposeTitle}
            direction="row"
            label={t('purposeTemplateName')}
          />
          <InformationContainer
            content={purposeTemplate.purposeDescription}
            direction="row"
            label={t('purposeTemplateDescription')}
          />
        </Stack>
      </SectionContainer>
      <SectionContainer innerSection title={t('thresholdTitle')}>
        <Stack spacing={2}>
          <InformationContainer
            content={`${suggestedApiCalls} ${t('dailyCallsLabel')}`}
            direction="row"
            label={t('thresholdLabel')}
          />
        </Stack>
      </SectionContainer>
    </Stack>
  )
}

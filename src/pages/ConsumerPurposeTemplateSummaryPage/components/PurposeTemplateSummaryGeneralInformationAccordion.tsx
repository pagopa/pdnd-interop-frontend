import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSuspenseQuery } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'

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

  return (
    <Stack spacing={2}>
      <InformationContainer
        content={purposeTemplate.purposeDescription}
        direction="row"
        label="TODO: ADD LABEL WHEN AVAILABLE"
      />
      TO DO
    </Stack>
  )
}

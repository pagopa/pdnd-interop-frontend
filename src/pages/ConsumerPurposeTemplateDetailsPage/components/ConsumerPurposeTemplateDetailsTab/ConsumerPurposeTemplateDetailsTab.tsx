import React from 'react'
import { Grid } from '@mui/material'
import { PurposeTemplateGeneralInfoSection } from './PurposeTemplateGeneralnfoSection'
import type { PurposeTemplate } from '@/api/purposeTemplate/mockedResponses'
import { PurposeTemplateLinkedEServicesSection } from './PurposeTemplateLinkedEServicesSection'
import { PurposeTemplateDocumentationSection } from './PurposeTemplateDocumentationSection'
import { PurposeTemplateThresholdSection } from './PurposeTemplateThresholdSection'

type ConsumerPurposeTemplateDetailsTabProps = {
  purposeTemplate: PurposeTemplate
}

export const ConsumerPurposeTemplateDetailsTab: React.FC<
  ConsumerPurposeTemplateDetailsTabProps
> = ({ purposeTemplate }) => {
  return (
    <>
      <Grid container>
        <Grid item xs={8}>
          <PurposeTemplateGeneralInfoSection purposeTemplate={purposeTemplate} />
          <PurposeTemplateLinkedEServicesSection />
          <PurposeTemplateDocumentationSection purposeTemplate={purposeTemplate} />
          <PurposeTemplateThresholdSection purposeTemplate={purposeTemplate} />
        </Grid>
      </Grid>
    </>
  )
}

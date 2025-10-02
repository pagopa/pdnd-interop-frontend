import React from 'react'
import { Grid } from '@mui/material'
import { PurposeTemplateGeneralInfoSection } from '../../../components/shared/PurposeTemplate/PurposeTemplateDetailsTab/PurposeTemplateGeneralnfoSection'
import { PurposeTemplateLinkedEServicesSection } from '../../../components/shared/PurposeTemplate/PurposeTemplateDetailsTab/PurposeTemplateLinkedEServicesSection'
import { PurposeTemplateDocumentationSection } from '../../../components/shared/PurposeTemplate/PurposeTemplateDetailsTab/PurposeTemplateDocumentationSection'
import { PurposeTemplateThresholdSection } from '../../../components/shared/PurposeTemplate/PurposeTemplateDetailsTab/PurposeTemplateThresholdSection'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'

type ConsumerPurposeTemplateDetailsTabProps = {
  purposeTemplate: PurposeTemplateWithCompactCreator
}

export const ConsumerPurposeTemplateDetailsTab: React.FC<
  ConsumerPurposeTemplateDetailsTabProps
> = ({ purposeTemplate }) => {
  const isThresholdSectionVisible = purposeTemplate.purposeDailyCalls ? true : false

  return (
    <>
      <Grid container>
        <Grid item xs={8}>
          <PurposeTemplateGeneralInfoSection purposeTemplate={purposeTemplate} />
          <PurposeTemplateLinkedEServicesSection />
          <PurposeTemplateDocumentationSection purposeTemplate={purposeTemplate} />
          {isThresholdSectionVisible && (
            <PurposeTemplateThresholdSection purposeTemplate={purposeTemplate} />
          )}
        </Grid>
      </Grid>
    </>
  )
}

import React from 'react'
import { Grid } from '@mui/material'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
import { PurposeTemplateGeneralInfoSection } from '@/components/shared/PurposeTemplate/PurposeTemplateDetailsTab/PurposeTemplateGeneralnfoSection'
import { PurposeTemplateDocumentationSection } from '@/components/shared/PurposeTemplate/PurposeTemplateDetailsTab/PurposeTemplateDocumentationSection'
import { PurposeTemplateLinkedEServicesSection } from '@/components/shared/PurposeTemplate/PurposeTemplateDetailsTab/PurposeTemplateLinkedEServicesSection'
import { PurposeTemplateThresholdSection } from '@/components/shared/PurposeTemplate/PurposeTemplateDetailsTab/PurposeTemplateThresholdSection'

type ConsumerPurposeTemplateCatalogDetailsTabProps = {
  purposeTemplate: PurposeTemplateWithCompactCreator
}

export const ConsumerPurposeTemplateCatalogDetailsTab: React.FC<
  ConsumerPurposeTemplateCatalogDetailsTabProps
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

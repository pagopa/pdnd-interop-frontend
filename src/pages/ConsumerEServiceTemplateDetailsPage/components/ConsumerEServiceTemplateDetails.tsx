import React from 'react'
import { Grid } from '@mui/material'
import { EServiceTemplateGeneralInfoSection } from '@/components/shared/EserviceTemplate/EServiceTemplateGeneralInfoSection'
import { ProviderEServiceTemplateTechnicalInfoSection } from '@/pages/ProviderEServiceTemplateDetailsPage/components/ProviderEServiceTemplateDetailsTab/ProviderEServiceTemplateTechnicalInfoSection'
import { ProviderEServiceTemplateAttributes } from '@/pages/ProviderEServiceTemplateDetailsPage/components/ProviderEServiceTemplateDetailsTab/ProviderEServiceTemplateAttributesSection'
import { EServiceTemplateTechnicalInfoSection } from '@/components/shared/EserviceTemplate'

export const ConsumerEServiceTemplateDetails: React.FC = () => {
  return (
    <>
      <Grid container>
        <Grid item xs={8}>
          <EServiceTemplateGeneralInfoSection
            readonly={true}
            routeKey="SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS"
          />
          <EServiceTemplateTechnicalInfoSection />
          <ProviderEServiceTemplateAttributes />
        </Grid>
      </Grid>
    </>
  )
}

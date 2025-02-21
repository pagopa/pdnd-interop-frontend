import React from 'react'
import { Grid } from '@mui/material'
import { EServiceTemplateGeneralInfoSection } from '@/components/shared/EserviceTemplate/EServiceTemplateGeneralInfoSection'
import { ProviderEServiceTemplateAttributes } from '@/pages/ProviderEServiceTemplateDetailsPage/components/ProviderEServiceTemplateDetailsTab/ProviderEServiceTemplateAttributesSection'
import { EServiceTemplateTechnicalInfoSection } from '@/components/shared/EserviceTemplate'

export const ConsumerEServiceTemplateDetails: React.FC = () => {
  const readyonly = true
  const routeKey = 'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS'

  return (
    <>
      <Grid container>
        <Grid item xs={8}>
          <EServiceTemplateGeneralInfoSection readonly={readyonly} routeKey={routeKey} />
          <EServiceTemplateTechnicalInfoSection readonly={readyonly} routeKey={routeKey} />
          <ProviderEServiceTemplateAttributes />
        </Grid>
      </Grid>
    </>
  )
}

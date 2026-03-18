import React from 'react'
import { Grid } from '@mui/material'
import {
  EServiceTemplateGeneralInfoSection,
  EServiceTemplateAttributes,
  EServiceTemplateTechnicalInfoSection,
} from '@/components/shared/EserviceTemplate'

export const ConsumerEServiceTemplateDetails: React.FC = () => {
  const readonly = true
  const routeKey = 'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS'

  return (
    <>
      <Grid container>
        <Grid item xs={8}>
          <EServiceTemplateGeneralInfoSection readonly={readonly} routeKey={routeKey} />
          <EServiceTemplateTechnicalInfoSection readonly={readonly} routeKey={routeKey} />
          <EServiceTemplateAttributes readonly={readonly} routeKey={routeKey} />
        </Grid>
      </Grid>
    </>
  )
}

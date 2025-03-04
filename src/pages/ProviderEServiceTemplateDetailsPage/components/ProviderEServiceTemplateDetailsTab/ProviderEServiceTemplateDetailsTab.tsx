import React from 'react'
import { Grid } from '@mui/material'
import {
  EServiceTemplateAttributes,
  EServiceTemplateGeneralInfoSection,
  EServiceTemplateTechnicalInfoSection,
} from '@/components/shared/EserviceTemplate'

export const ProviderEServiceTemplateDetailsTab: React.FC = () => {
  const readonly = false
  const routeKey = 'PROVIDE_ESERVICE_TEMPLATE_DETAILS'
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

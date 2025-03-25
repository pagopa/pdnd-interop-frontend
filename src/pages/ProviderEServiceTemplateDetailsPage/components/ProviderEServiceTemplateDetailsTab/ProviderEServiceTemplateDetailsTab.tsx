import React from 'react'
import { Grid } from '@mui/material'
import {
  EServiceTemplateAttributes,
  EServiceTemplateGeneralInfoSection,
  EServiceTemplateTechnicalInfoSection,
} from '@/components/shared/EserviceTemplate'
import type { EServiceTemplateVersionState } from '@/api/api.generatedTypes'

type ProviderEServiceDetailsTabProps = {
  templateVersionState: EServiceTemplateVersionState | undefined
}
export const ProviderEServiceTemplateDetailsTab: React.FC<ProviderEServiceDetailsTabProps> = ({
  templateVersionState,
}) => {
  const readonly = templateVersionState === 'DEPRECATED'
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

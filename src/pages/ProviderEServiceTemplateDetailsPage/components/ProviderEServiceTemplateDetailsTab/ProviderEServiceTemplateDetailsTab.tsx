import React from 'react'
import { Grid } from '@mui/material'
import {
  EServiceTemplateGeneralInfoSection,
  EServiceTemplateTechnicalInfoSection,
} from '@/components/shared/EserviceTemplate'
import type { EServiceTemplateVersionState } from '@/api/api.generatedTypes'
import { EServiceTemplateThresholdsAndAttributesSection } from './EServiceTemplateThresholdsAndAttributesSection'
import { AuthHooks } from '@/api/auth'

type ProviderEServiceDetailsTabProps = {
  eserviceTemplateVersionState: EServiceTemplateVersionState | undefined
}
export const ProviderEServiceTemplateDetailsTab: React.FC<ProviderEServiceDetailsTabProps> = ({
  eserviceTemplateVersionState,
}) => {
  const { isViewer } = AuthHooks.useJwt()
  const readonly = eserviceTemplateVersionState === 'DEPRECATED' || isViewer
  const routeKey = 'PROVIDE_ESERVICE_TEMPLATE_DETAILS'
  return (
    <>
      <Grid container>
        <Grid item xs={8}>
          <EServiceTemplateGeneralInfoSection readonly={readonly} routeKey={routeKey} />
          <EServiceTemplateTechnicalInfoSection readonly={readonly} routeKey={routeKey} />
          <EServiceTemplateThresholdsAndAttributesSection readonly={readonly} routeKey={routeKey} />
        </Grid>
      </Grid>
    </>
  )
}

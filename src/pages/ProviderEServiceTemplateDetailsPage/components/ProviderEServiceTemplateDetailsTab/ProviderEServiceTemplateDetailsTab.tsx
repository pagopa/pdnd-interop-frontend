import React from 'react'
import { Grid } from '@mui/material'
import {
  EServiceTemplateGeneralInfoSection,
  EServiceTemplateTechnicalInfoSection,
} from '@/components/shared/EserviceTemplate'
import type { EServiceTemplateVersionState } from '@/api/api.generatedTypes'
import { EServiceTemplateThresholdsAndAttributesSection } from './EServiceTemplateThresholdsAndAttributesSection'

type ProviderEServiceDetailsTabProps = {
  eserviceTemplateVersionState: EServiceTemplateVersionState | undefined
}
export const ProviderEServiceTemplateDetailsTab: React.FC<ProviderEServiceDetailsTabProps> = ({
  eserviceTemplateVersionState,
}) => {
  const readonly = eserviceTemplateVersionState === 'DEPRECATED'
  const routeKey = 'PROVIDE_ESERVICE_TEMPLATE_DETAILS'
  return (
    <>
      <Grid container>
        <Grid item xs={8}>
          <EServiceTemplateGeneralInfoSection readonly={readonly} routeKey={routeKey} />
          <EServiceTemplateTechnicalInfoSection
            readonly={readonly}
            routeKey={routeKey}
            hideThresholds
          />
          <EServiceTemplateThresholdsAndAttributesSection readonly={readonly} routeKey={routeKey} />
        </Grid>
      </Grid>
    </>
  )
}

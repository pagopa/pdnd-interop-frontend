import React from 'react'
import { Grid } from '@mui/material'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { ProviderEServiceTemplateGeneralInfoSection } from './ProviderEServiceTemplateGeneralInfoSection/ProviderEServiceTemplateGeneralInfoSection'
import { TemplateQueries } from '@/api/template'
import { ProviderEServiceTemplateTechnicalInfoSection } from './ProviderEServiceTemplateTechnicalInfoSection'
import { ProviderEServiceTemplateAttributes } from './ProviderEServiceTemplateAttributes'

export const ProviderEServiceTemplateDetailsTab: React.FC = () => {
  //const { eserviceId } = useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()
  const eserviceId = '1' //TODO

  const { data: template } = useQuery(TemplateQueries.getSingle(eserviceId))

  return (
    <>
      <Grid container>
        <Grid item xs={8}>
          <ProviderEServiceTemplateGeneralInfoSection />
          <ProviderEServiceTemplateTechnicalInfoSection />
          <ProviderEServiceTemplateAttributes />
        </Grid>
      </Grid>
    </>
  )
}

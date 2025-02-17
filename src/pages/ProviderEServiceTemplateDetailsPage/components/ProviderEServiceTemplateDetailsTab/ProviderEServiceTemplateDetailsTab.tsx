import React from 'react'
import { Grid } from '@mui/material'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { ProviderEServiceTemplateGeneralInfoSection } from './ProviderEServiceTemplateGeneralInfoSection/ProviderEServiceTemplateGeneralInfoSection'
import { TemplateQueries } from '@/api/template'
import { ProviderEServiceTemplateTechnicalInfoSection } from './ProviderEServiceTemplateTechnicalInfoSection'
import { ProviderEServiceTemplateAttributes } from './ProviderEServiceTemplateAttributesSection'

export const ProviderEServiceTemplateDetailsTab: React.FC = () => {
  const { eServiceTemplateId, eServiceTemplateVersionId } =
    useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()

  const { data: template } = useQuery(
    TemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId) //TODO
  )

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

import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSuspenseQuery } from '@tanstack/react-query'
import { TemplateQueries } from '@/api/template'
import { ProviderEServiceTemplateThresholdsSection } from '@/pages/ProviderEServiceTemplateDetailsPage/components/ProviderEServiceTemplateDetailsTab/ProviderEServiceTemplateTechnicalInfoSection/ProviderEServiceTemplateThresholdsSection'
import { ProviderEServiceTemplateDocumentationSection } from '@/pages/ProviderEServiceTemplateDetailsPage/components/ProviderEServiceTemplateDetailsTab/ProviderEServiceTemplateTechnicalInfoSection/ProviderEServiceTemplateDocumentationSection'
import { ProviderEServiceTemplateUsefulLinksSection } from '@/pages/ProviderEServiceTemplateDetailsPage/components/ProviderEServiceTemplateDetailsTab/ProviderEServiceTemplateTechnicalInfoSection/ProviderEServiceTemplateUsefulLinksSection'

export const EServiceTemplateTechnicalInfoSection: React.FC = () => {
  const { t } = useTranslation('template', {
    keyPrefix: 'read.sections.technicalInformations',
  })

  const { eServiceTemplateId, eServiceTemplateVersionId } =
    useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()
  const { data: template } = useSuspenseQuery(
    TemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        <SectionContainer innerSection>
          <Stack spacing={2}>
            <InformationContainer
              label={t('technology')}
              content={template.eserviceTemplate.technology}
            />

            <InformationContainer
              label={t('mode.label')}
              labelDescription={t('mode.labelDescription')}
              content={t(`mode.value.${template.eserviceTemplate.mode}`)}
            />
          </Stack>
        </SectionContainer>
        <Divider />
        <ProviderEServiceTemplateThresholdsSection template={template} />
        <Divider />
        <ProviderEServiceTemplateDocumentationSection template={template} />
        <Divider />
        <ProviderEServiceTemplateUsefulLinksSection />
      </Stack>
    </SectionContainer>
  )
}

export const ProviderEServiceTemplateTechnicalInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}

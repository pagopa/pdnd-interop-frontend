import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSuspenseQuery } from '@tanstack/react-query'
import { TemplateQueries } from '@/api/template'
import { EServiceTemplateThresholdsSection } from './EServiceTemplateThresholdsSection'
import { EServiceTemplateDocumentationSection } from './EServiceTemplateDocumentationSection'
import { EServiceTemplateUsefulLinksSection } from './EServiceTemplateUsefulLinksSection'

type EServiceTemplateTechnicalInfoSectionProps = {
  readonly: boolean
  routeKey: 'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS' | 'PROVIDE_ESERVICE_TEMPLATE_DETAILS'
}
export const EServiceTemplateTechnicalInfoSection: React.FC<
  EServiceTemplateTechnicalInfoSectionProps
> = ({ readonly, routeKey }) => {
  const { t } = useTranslation('template', {
    keyPrefix: 'read.sections.technicalInformations',
  })

  const { eServiceTemplateId, eServiceTemplateVersionId } = useParams<typeof routeKey>()
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
        <EServiceTemplateThresholdsSection readonly={readonly} template={template} />
        <Divider />
        <EServiceTemplateDocumentationSection readonly={readonly} templateVersion={template} />
        <Divider />
        <EServiceTemplateUsefulLinksSection />
      </Stack>
    </SectionContainer>
  )
}

export const ProviderEServiceTemplateTechnicalInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}

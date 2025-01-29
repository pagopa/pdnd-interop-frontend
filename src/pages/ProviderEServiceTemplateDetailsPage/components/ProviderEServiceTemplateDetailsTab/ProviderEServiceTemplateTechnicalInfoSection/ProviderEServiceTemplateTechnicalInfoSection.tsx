import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSuspenseQuery } from '@tanstack/react-query'
import { STAGE } from '@/config/env'
import type { PagoPAEnvVars } from '@/types/common.types'
import { TemplateQueries } from '@/api/template'
import { ProviderEServiceThresholdsSection } from './ProviderEServiceTemplateThresholdsSection'
import { ProviderEServiceTemplateDocumentationSection } from './ProviderEServiceTemplateDocumentationSection'
import { ProviderEServiceTemplateUsefulLinksSection } from './ProviderEServiceTemplateUsefulLinksSection'

export const ProviderEServiceTemplateTechnicalInfoSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.technicalInformations',
  })

  //const { eservicetemplateId } = useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()
  const eserviceTemplateId = '1'
  const { data: template } = useSuspenseQuery(TemplateQueries.getSingle(eserviceTemplateId))

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        <SectionContainer innerSection>
          <Stack spacing={2}>
            <InformationContainer label={t('technology')} content={template.technology} />

            <InformationContainer
              label={t('mode.label')}
              labelDescription={t('mode.labelDescription')}
              content={t(`mode.value.${template.mode}`)}
            />
          </Stack>
        </SectionContainer>
        <Divider />
        <ProviderEServiceThresholdsSection template={template} />
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

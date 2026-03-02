import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { EServiceTemplateThresholdsSection } from './EServiceTemplateThresholdsSection'
import { EServiceTemplateDocumentationSection } from './EServiceTemplateDocumentationSection'
import { EServiceTemplateUsefulLinksSection } from './EServiceTemplateUsefulLinksSection'
import { secondsToMinutes } from '@/utils/format.utils'

type EServiceTemplateTechnicalInfoSectionProps = {
  readonly: boolean
  routeKey: 'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS' | 'PROVIDE_ESERVICE_TEMPLATE_DETAILS'
  hideThresholds?: boolean
}
export const EServiceTemplateTechnicalInfoSection: React.FC<
  EServiceTemplateTechnicalInfoSectionProps
> = ({ readonly, routeKey, hideThresholds = false }) => {
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'read.sections.technicalInformations',
  })
  const { t: tCommon } = useTranslation('common')

  const { eServiceTemplateId, eServiceTemplateVersionId } = useParams<typeof routeKey>()
  const { data: eserviceTemplate } = useSuspenseQuery(
    EServiceTemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  const voucherLifespan = secondsToMinutes(eserviceTemplate.voucherLifespan)

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        <SectionContainer innerSection>
          <Stack spacing={2}>
            <InformationContainer
              label={t('technology')}
              content={eserviceTemplate.eserviceTemplate.technology}
            />

            <InformationContainer
              label={t('mode.label')}
              labelDescription={t('mode.labelDescription')}
              content={t(`mode.value.${eserviceTemplate.eserviceTemplate.mode}`)}
            />

            <InformationContainer
              label={t('thresholds.voucherLifespan.label')}
              labelDescription={t('thresholds.voucherLifespan.labelDescription')}
              content={`${voucherLifespan} ${tCommon('time.minute', {
                count: voucherLifespan,
              })}`}
            />
          </Stack>
        </SectionContainer>
        {!hideThresholds && (
          <>
            <Divider />
            <EServiceTemplateThresholdsSection
              readonly={readonly}
              eserviceTemplate={eserviceTemplate}
            />
          </>
        )}
        <Divider />
        <EServiceTemplateDocumentationSection
          readonly={readonly}
          eserviceTemplateVersion={eserviceTemplate}
        />
        <Divider />
        <EServiceTemplateUsefulLinksSection />
      </Stack>
    </SectionContainer>
  )
}

export const ProviderEServiceTemplateTechnicalInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}

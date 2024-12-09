import { EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProviderEServiceThresholdsSection } from './ProviderEServiceThresholdsSection'
import { ProviderEServiceUsefulLinksSection } from './ProviderEServiceUsefulLinksSection'
import { ProviderEServiceDocumentationSection } from './ProviderEServiceDocumentationSection'
import { useSuspenseQuery } from '@tanstack/react-query'
import { STAGE } from '@/config/env'
import type { PagoPAEnvVars } from '@/types/common.types'

export const ProviderEServiceTechnicalInfoSection: React.FC = () => {
  const signalHubFlagDisabledStage: PagoPAEnvVars['STAGE'][] = ['PROD', 'UAT']
  const isSignalHubFlagDisabled = signalHubFlagDisabledStage.includes(STAGE) //check on the environment for signal hub flag
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.technicalInformations',
  })

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        <SectionContainer innerSection>
          <Stack spacing={2}>
            <InformationContainer
              label={t('technology')}
              content={descriptor.eservice.technology}
            />

            <InformationContainer label={t('audience')} content={descriptor.audience[0]} />

            <InformationContainer
              label={t('mode.label')}
              labelDescription={t('mode.labelDescription')}
              content={t(`mode.value.${descriptor.eservice.mode}`)}
            />
            {!isSignalHubFlagDisabled && (
              <InformationContainer
                label={t('isSignalHubEnabled.label')}
                content={t(`isSignalHubEnabled.value.${descriptor.eservice.isSignalHubEnabled}`)}
              />
            )}
          </Stack>
        </SectionContainer>
        <Divider />
        <ProviderEServiceThresholdsSection descriptor={descriptor} />
        <Divider />
        <ProviderEServiceDocumentationSection descriptor={descriptor} />
        <Divider />
        <ProviderEServiceUsefulLinksSection />
      </Stack>
    </SectionContainer>
  )
}

export const ProviderEServiceTechnicalInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}

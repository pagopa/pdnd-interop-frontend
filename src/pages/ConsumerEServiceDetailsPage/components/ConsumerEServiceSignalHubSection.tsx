import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { IconLink } from '@/components/shared/IconLink'
import LaunchIcon from '@mui/icons-material/Launch'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EServiceQueries } from '@/api/eservice'

export const ConsumerEServiceSignalHubSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.signalHub',
  })

  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  const isSignalHubEnabled = descriptor.eservice.isSignalHubEnabled ?? false

  return (
    <>
      <SectionContainer
        title={t('title')}
        description={
          <p>
            {t('description.before')}{' '}
            <IconLink href={''} target="_blank" endIcon={<LaunchIcon fontSize="small" />}>
              {' '}
              {/** TODO LINK */}
              {t('description.linkLabel')}
            </IconLink>{' '}
            {t('description.after')}
          </p>
        }
      >
        <SectionContainer innerSection>
          <Stack spacing={2}>
            <InformationContainer
              label={t('consumer.status.label')}
              content={t(`consumer.status.content.${isSignalHubEnabled}`)}
            />
          </Stack>
        </SectionContainer>
      </SectionContainer>
    </>
  )
}

export const ConsumerEServiceSignalHubSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}

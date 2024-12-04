import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { ProviderEServiceDetailsAlerts } from './components/ProviderEServiceDetailsAlerts'
import { Grid } from '@mui/material'
import {
  ProviderEServiceDescriptorAttributes,
  ProviderEServiceDescriptorAttributesSkeleton,
} from './components/ProviderEServiceDescriptorAttributes'
import {
  ProviderEServiceGeneralInfoSection,
  ProviderEServiceGeneralInfoSectionSkeleton,
} from './components/ProviderEServiceGeneralInfoSection'
import { useGetProviderEServiceActions } from '@/hooks/useGetProviderEServiceActions'
import { useTranslation } from 'react-i18next'
import {
  ProviderEServiceTechnicalInfoSection,
  ProviderEServiceTechnicalInfoSectionSkeleton,
} from './components/ProviderEServiceTechnicalInfoSection'
import { useQuery } from '@tanstack/react-query'

const ProviderEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })
  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()

  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  const { actions } = useGetProviderEServiceActions(
    eserviceId,
    descriptor?.state,
    descriptorId,
    descriptor?.eservice.draftDescriptor?.id,
    descriptor?.eservice.mode
  )

  return (
    <PageContainer
      title={descriptor?.eservice.name || ''}
      topSideActions={actions}
      isLoading={!descriptor}
      statusChip={
        descriptor
          ? {
              for: 'eservice',
              state: descriptor?.state,
            }
          : undefined
      }
      backToAction={{
        label: t('actions.backToListLabel'),
        to: 'PROVIDE_ESERVICE_LIST',
      }}
    >
      <ProviderEServiceDetailsAlerts descriptor={descriptor} />
      <Grid container>
        <Grid item xs={8}>
          <React.Suspense fallback={<ProviderEServiceGeneralInfoSectionSkeleton />}>
            <ProviderEServiceGeneralInfoSection />
          </React.Suspense>
          <React.Suspense fallback={<ProviderEServiceTechnicalInfoSectionSkeleton />}>
            <ProviderEServiceTechnicalInfoSection />
          </React.Suspense>
          <React.Suspense fallback={<ProviderEServiceDescriptorAttributesSkeleton />}>
            <ProviderEServiceDescriptorAttributes />
          </React.Suspense>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default ProviderEServiceDetailsPage

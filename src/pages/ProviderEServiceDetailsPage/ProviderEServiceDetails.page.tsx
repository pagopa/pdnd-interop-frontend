import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { ProviderEServiceDetailsAlerts } from './components/ProviderEServiceDetailsAlerts'
import { Grid, Tab } from '@mui/material'
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
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  ProviderEServiceStatus,
  ProviderEServiceStatusSkeleton,
} from './components/ProviderEServiceStatus'
import { useActiveTab } from '@/hooks/useActiveTab'

const ProviderEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })
  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()

  const { activeTab, updateActiveTab } = useActiveTab('details')

  const { data: descriptor } = EServiceQueries.useGetDescriptorProvider(eserviceId, descriptorId, {
    suspense: false,
  })

  const { actions } = useGetProviderEServiceActions(
    descriptor?.eservice.id,
    descriptor?.state,
    descriptor?.id,
    descriptor?.eservice.draftDescriptor?.id,
    descriptor?.eservice.mode
  )

  return (
    <PageContainer
      title={descriptor?.eservice.name || ''}
      newTopSideActions={actions}
      isLoading={!descriptor}
      statusChip={descriptor ? { for: 'eservice', state: descriptor?.state } : undefined}
      backToAction={{
        label: t('actions.backToListLabel'),
        to: 'PROVIDE_ESERVICE_LIST',
      }}
    >
      <ProviderEServiceDetailsAlerts descriptor={descriptor} />
      <TabContext value={activeTab}>
        <TabList onChange={updateActiveTab} variant="fullWidth">
          <Tab label={'Dettagli dell’E-Service'} value="details" />
          <Tab label={'Stato dell’E-Service'} value="status" />
        </TabList>

        <TabPanel value="details">
          <Grid container>
            <Grid item xs={8}>
              <React.Suspense fallback={<ProviderEServiceGeneralInfoSectionSkeleton />}>
                <ProviderEServiceGeneralInfoSection />
              </React.Suspense>
              <React.Suspense fallback={<ProviderEServiceDescriptorAttributesSkeleton />}>
                <ProviderEServiceDescriptorAttributes />
              </React.Suspense>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value="status">
          <React.Suspense fallback={<ProviderEServiceStatusSkeleton />}>
            <ProviderEServiceStatus />
          </React.Suspense>
        </TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default ProviderEServiceDetailsPage

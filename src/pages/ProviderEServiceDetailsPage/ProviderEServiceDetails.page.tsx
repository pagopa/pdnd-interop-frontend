import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Tab } from '@mui/material'
import { useGetProviderEServiceActions } from '@/hooks/useGetProviderEServiceActions'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useActiveTab } from '@/hooks/useActiveTab'
import { ProviderEserviceDetailsTab } from './components/ProviderEServiceDetailsTab/ProviderEServiceDetailsTab'
import { ProviderEserviceKeychainsTab } from './components/ProviderEServiceKeychainsTab/ProviderEServiceKeychainsTab'

const ProviderEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })
  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()

  const { activeTab, updateActiveTab } = useActiveTab('eserviceDetails')

  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  const { actions } = useGetProviderEServiceActions(
    eserviceId,
    descriptor?.state,
    descriptor?.eservice.draftDescriptor?.state,
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
      <TabContext value={activeTab}>
        <TabList onChange={updateActiveTab} aria-label={t('tabs.ariaLabel')} variant="fullWidth">
          <Tab label={t('tabs.eserviceDetails')} value="eserviceDetails" />
          <Tab label={t('tabs.keychain')} value="keychains" />
        </TabList>

        <TabPanel value="eserviceDetails">
          <ProviderEserviceDetailsTab />
        </TabPanel>

        <TabPanel value="keychains">
          <ProviderEserviceKeychainsTab />
        </TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default ProviderEServiceDetailsPage

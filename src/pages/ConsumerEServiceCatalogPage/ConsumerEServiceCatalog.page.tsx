import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { ProductUpdatesBanner } from '@/components/shared/banners/ProductUpdatesBanner'
import { Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useActiveTab } from '@/hooks/useActiveTab'
import AllEServicesTab from './AllEservicesTab'
import FeaturedEServicesTab from './FeaturedEServicesTab'

const ConsumerEServiceCatalogPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerEServiceCatalog' })

  const { activeTab, updateActiveTab } = useActiveTab('featuredEServices')

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <ProductUpdatesBanner />
      <TabContext value={activeTab}>
        <TabList onChange={updateActiveTab} aria-label={t('tabs.ariaLabel')} variant="fullWidth">
          <Tab label={t('tabs.featuredEServices')} value="featuredEServices" />
          <Tab label={t('tabs.allEServices')} value="allEServices" />
        </TabList>

        <TabPanel value="featuredEServices">
          <FeaturedEServicesTab />
        </TabPanel>

        <TabPanel value="allEServices">
          <AllEServicesTab />
        </TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default ConsumerEServiceCatalogPage

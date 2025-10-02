import { useTranslation } from 'react-i18next'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { PageContainer } from '@/components/layout/containers'
import useGetConsumerPurposeTemplateTemplatesActions from '@/hooks/useGetConsumerPurposeTemplatesActions'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { useActiveTab } from '@/hooks/useActiveTab'
import { ConsumerPurposeTemplateCatalogDetailsTab } from './components/ConsumerPurposeTemplateCatalogDetailsTab'
import { ConsumerPurposeTemplateCatalogLinkedEServiceTab } from './components/ConsumerPurposeTemplateCatalogLinkedEServiceTab'

const ConsumerPurposeTemplateCatalogDetailsPage: React.FC = () => {
  const { t } = useTranslation('purposeTemplate')

  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS'>()

  const { data: purposeTemplate } = useQuery(PurposeTemplateQueries.getSingle(purposeTemplateId))

  const { activeTab, updateActiveTab } = useActiveTab('details')

  const { actions } = useGetConsumerPurposeTemplateTemplatesActions('PA', purposeTemplate) //TO DO: TENANT KIND WILL BE PASSED BY BFF

  if (!purposeTemplate) return

  console.log(purposeTemplate)

  return (
    <PageContainer
      title={purposeTemplate?.purposeTitle || ''}
      isLoading={!purposeTemplate}
      topSideActions={actions}
      statusChip={
        purposeTemplate
          ? {
              for: 'purposeTemplate',
              state: purposeTemplate?.state,
            }
          : undefined
      }
      backToAction={{
        label: t('backToListBtn'),
        to: 'SUBSCRIBE_PURPOSE_TEMPLATE_LIST',
      }}
    >
      <TabContext value={activeTab}>
        <TabList
          onChange={updateActiveTab}
          aria-label={t('read.tabs.ariaLabel')}
          variant="fullWidth"
        >
          <Tab label={t('read.tabs.details')} value="details" />
          <Tab label={t('read.tabs.linkedEservices')} value="linkedEservices" />
          <Tab label={t('read.tabs.riskAnalysis')} value="riskAnalysis" />
        </TabList>

        <TabPanel value="details">
          <ConsumerPurposeTemplateCatalogDetailsTab purposeTemplate={purposeTemplate} />
        </TabPanel>

        <TabPanel value="linkedEservices">
          <ConsumerPurposeTemplateCatalogLinkedEServiceTab purposeTemplate={purposeTemplate} />
        </TabPanel>

        <TabPanel value="riskAnalysis">TO DO</TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default ConsumerPurposeTemplateCatalogDetailsPage

import { useTranslation } from 'react-i18next'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { PageContainer } from '@/components/layout/containers'
import useGetConsumerPurposeTemplateTemplatesActions from '@/hooks/useGetConsumerPurposeTemplatesActions'
import { ConsumerPurposeTemplateDetailsTab } from './components/ConsumerPurposeTemplateDetailsTab/ConsumerPurposeTemplateDetailsTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { useActiveTab } from '@/hooks/useActiveTab'
import { ConsumerPurposeTemplateLinkedEServiceTab } from './components/ConsumerPurposeTemplateLinkedEServiceTab/ConsumerPurposeTemplateLinkedEServiceTab'

const ConsumerPurposeTemplateDetailsPage: React.FC = () => {
  const { t } = useTranslation('purposeTemplate')

  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS'>()

  const { data: purposeTemplate } = useQuery(PurposeTemplateQueries.getSingle(purposeTemplateId))

  const { actions } = useGetConsumerPurposeTemplateTemplatesActions(purposeTemplate)

  const { activeTab, updateActiveTab } = useActiveTab('details')

  if (!purposeTemplate) return //TODO FIX THIS

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
          <ConsumerPurposeTemplateDetailsTab purposeTemplate={purposeTemplate} />
        </TabPanel>

        <TabPanel value="linkedEservices">
          <ConsumerPurposeTemplateLinkedEServiceTab purposeTemplate={purposeTemplate} />
        </TabPanel>

        <TabPanel value="riskAnalysis">TO DO</TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default ConsumerPurposeTemplateDetailsPage

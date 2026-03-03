import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Tab } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useActiveTab } from '@/hooks/useActiveTab'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { ConsumerEServiceTemplateDetails, ConsumerEServiceTemplateInstancesTab } from './components'
import { useGetConsumerEServiceTemplateActions } from './hooks/useGetConsumerEServiceTemplateActions'

const ConsumerEServiceTemplateDetailsPage: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'read' })
  const { eServiceTemplateId, eServiceTemplateVersionId } =
    useParams<'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS'>()

  const { activeTab, updateActiveTab } = useActiveTab('eserviceTemplateDetails')

  const { data: eserviceTemplate } = useQuery(
    EServiceTemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  const hasRequesterRiskAnalysis = eserviceTemplate?.hasRequesterRiskAnalysis ?? true
  const hasPersonalDataValue = eserviceTemplate?.eserviceTemplate.personalData !== undefined

  const { actions } = useGetConsumerEServiceTemplateActions(
    eServiceTemplateId,
    hasRequesterRiskAnalysis,
    eserviceTemplate?.state,
    hasPersonalDataValue
  )
  return (
    <PageContainer
      title={eserviceTemplate?.eserviceTemplate.name || ''}
      isLoading={!eserviceTemplate}
      topSideActions={actions}
      statusChip={
        eserviceTemplate
          ? {
              for: 'eserviceTemplate',
              state: eserviceTemplate?.state,
            }
          : undefined
      }
      backToAction={{
        label: t('actions.backToEserviceTemplateCatalog'),
        to: 'PROVIDE_ESERVICE_TEMPLATE_CATALOG',
      }}
    >
      <TabContext value={activeTab}>
        <TabList onChange={updateActiveTab} aria-label={t('tabs.ariaLabel')} variant="fullWidth">
          <Tab label={t('tabs.eserviceTemplateDetails')} value="eserviceTemplateDetails" />
          <Tab label={t('tabs.eserviceTemplateInstances')} value="eserviceTemplateInstances" />
        </TabList>
        <TabPanel value="eserviceTemplateDetails">
          <ConsumerEServiceTemplateDetails />
        </TabPanel>
        <TabPanel value="eserviceTemplateInstances">
          <ConsumerEServiceTemplateInstancesTab
            eserviceTemplateVersions={eserviceTemplate?.eserviceTemplate.versions ?? []}
          />
        </TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default ConsumerEServiceTemplateDetailsPage

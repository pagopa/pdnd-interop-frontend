import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Tab } from '@mui/material'
import { useGetProviderEServiceActions } from '@/hooks/useGetProviderEServiceActions'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TemplateQueries } from '@/api/template'
import { ProviderEServiceTemplateDetailsTab } from './components/ProviderEServiceTemplateDetailsTab/ProviderEServiceTemplateDetailsTab'
import { ProviderEServiceTemplateTenantsTab } from './components/ProviderEServiceTemplateTenantsTab/ProviderEServiceTemplateTenantsTab'

const ProviderEServiceTemplateDetailsPage: React.FC = () => {
  const { t } = useTranslation('template', { keyPrefix: 'read' })
  const { eserviceTemplateId } = useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()

  const { activeTab, updateActiveTab } = useActiveTab('eserviceTemplateDetails')

  const { data: template } = useQuery(TemplateQueries.getSingle(eserviceTemplateId))

  /*const { actions } = useGetProviderEServiceActions(  //TODO
    eserviceId,
    descriptor?.state,
    descriptor?.eservice.draftDescriptor?.state,
    descriptorId,
    descriptor?.eservice.draftDescriptor?.id,
    descriptor?.eservice.mode
  )*/

  return (
    <PageContainer
      title={template?.name || ''}
      topSideActions={['']} //TODO
      isLoading={!template}
      statusChip={
        //TODO è la chip per template è già implementata nel branch pin-6016
        template
          ? {
              for: 'eservice', // TODO sostituire con template
              state: template?.state,
            }
          : undefined
      }
      backToAction={{
        label: t('actions.backToEserviceTemplateListLabel'),
        to: 'PROVIDE_ESERVICE_TEMPLATES_LIST',
      }}
    >
      <TabContext value={activeTab}>
        <TabList onChange={updateActiveTab} aria-label={t('tabs.ariaLabel')} variant="fullWidth">
          <Tab label={t('tabs.eserviceTemplateDetails')} value="eserviceTemplateDetails" />
          <Tab label={t('tabs.eserviceTemplateTenants')} value="eserviceTemplateTenants" />
        </TabList>
        <TabPanel value="eserviceTemplateDetails">
          <ProviderEServiceTemplateDetailsTab />
        </TabPanel>
        <TabPanel value="eserviceTemplateTenants">
          <ProviderEServiceTemplateTenantsTab />
        </TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default ProviderEServiceTemplateDetailsPage

import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Tab } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TemplateQueries } from '@/api/template'
import { ProviderEServiceTemplateDetailsTab } from './components/ProviderEServiceTemplateDetailsTab/ProviderEServiceTemplateDetailsTab'
import { ProviderEServiceTemplateTenantsTab } from './components/ProviderEServiceTemplateTenantsTab/ProviderEServiceTemplateTenantsTab'
import { useGetProviderEServiceTemplateActions } from '@/hooks/useGetProviderEServiceTemplateActions'

const ProviderEServiceTemplateDetailsPage: React.FC = () => {
  const { t } = useTranslation('template', { keyPrefix: 'read' })
  const { eServiceTemplateId, eServiceTemplateVersionId } =
    useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()

  const { activeTab, updateActiveTab } = useActiveTab('eserviceTemplateDetails')

  const { data: template } = useQuery(
    TemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  const { actions } = useGetProviderEServiceTemplateActions(
    //TODO ACTIVEVERSION E DRAFT VERSION NON MI VENGONO TORNATE DALLA GETSINGLE
    eServiceTemplateId,
    eServiceTemplateVersionId,
    template?.state,
    template?.eserviceTemplate.mode
  )

  return (
    <PageContainer
      title={template?.eserviceTemplate.name || ''}
      topSideActions={actions}
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

import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Tab } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { NotificationMutations } from '@/api/notification'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useActiveTab } from '@/hooks/useActiveTab'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { ProviderEServiceTemplateDetailsTab } from './components/ProviderEServiceTemplateDetailsTab/ProviderEServiceTemplateDetailsTab'
import { ProviderEServiceTemplateTenantsTab } from './components/ProviderEServiceTemplateTenantsTab/ProviderEServiceTemplateTenantsTab'
import { useGetProviderEServiceTemplateActions } from '@/hooks/useGetProviderEServiceTemplateActions'

const ProviderEServiceTemplateDetailsPage: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'read' })
  const { eServiceTemplateId, eServiceTemplateVersionId } =
    useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()

  const { mutate: markNotificationsAsRead } =
    NotificationMutations.useMarkNotificationsAsReadByEntityId()

  const { activeTab, updateActiveTab } = useActiveTab('eserviceTemplateDetails')

  const { data: eserviceTemplate } = useQuery(
    EServiceTemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  React.useEffect(() => {
    if (eServiceTemplateId) {
      markNotificationsAsRead({ entityId: eServiceTemplateId })
    }
  }, [eServiceTemplateId, markNotificationsAsRead])

  const { actions } = useGetProviderEServiceTemplateActions(
    eServiceTemplateId,
    eServiceTemplateVersionId,
    eserviceTemplate?.eserviceTemplate.draftVersion?.id,
    eserviceTemplate?.state,
    eserviceTemplate?.eserviceTemplate.draftVersion?.state,
    eserviceTemplate?.eserviceTemplate.mode
  )

  return (
    <PageContainer
      title={eserviceTemplate?.eserviceTemplate.name || ''}
      topSideActions={actions}
      isLoading={!eserviceTemplate}
      statusChip={
        eserviceTemplate
          ? {
              for: 'eserviceTemplate',
              state: eserviceTemplate?.state,
            }
          : undefined
      }
      backToAction={{
        label: t('actions.backToEserviceTemplateListLabel'),
        to: 'PROVIDE_ESERVICE_TEMPLATE_LIST',
      }}
    >
      <TabContext value={activeTab}>
        <TabList onChange={updateActiveTab} aria-label={t('tabs.ariaLabel')} variant="fullWidth">
          <Tab label={t('tabs.eserviceTemplateDetails')} value="eserviceTemplateDetails" />
          <Tab label={t('tabs.eserviceTemplateTenants')} value="eserviceTemplateTenants" />
        </TabList>
        <TabPanel value="eserviceTemplateDetails">
          <ProviderEServiceTemplateDetailsTab
            eserviceTemplateVersionState={eserviceTemplate?.state}
          />
        </TabPanel>
        <TabPanel value="eserviceTemplateTenants">
          <ProviderEServiceTemplateTenantsTab
            eserviceTemplateVersions={eserviceTemplate?.eserviceTemplate.versions ?? []}
          />
        </TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default ProviderEServiceTemplateDetailsPage

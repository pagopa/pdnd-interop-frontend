import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import { useMarkNotificationsAsRead } from '@/hooks/useMarkNotificationsAsRead'
import { Tab } from '@mui/material'
import { useGetProviderEServiceActions } from '@/hooks/useGetProviderEServiceActions'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useActiveTab } from '@/hooks/useActiveTab'
import { ProviderEserviceDetailsTab } from './components/ProviderEServiceDetailsTab/ProviderEServiceDetailsTab'
import { ProviderEserviceKeychainsTab } from './components/ProviderEServiceKeychainsTab/ProviderEServiceKeychainsTab'
import { NewPageContainer } from '@/components/layout/containers/NewPageContainer'
import { useDialog } from '@/stores'
import { useDrawerState } from '@/hooks/useDrawerState'
import { EServiceVersionSelectorDrawer } from '@/components/shared/EServiceVersionSelectorDrawer'
import { getViewLatestVersionTargetId } from '@/utils/eservice.utils'

const ProviderEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })
  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()

  const { activeTab, updateActiveTab } = useActiveTab('eserviceDetails')
  const { openDialog } = useDialog()
  const {
    isOpen: isVersionSelectorDrawerOpen,
    openDrawer: openVersionSelectorDrawer,
    closeDrawer: closeVersionSelectorDrawer,
  } = useDrawerState()

  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  useMarkNotificationsAsRead(`${eserviceId}/${descriptorId}`)

  const isEserviceFromTemplate = Boolean(descriptor?.templateRef)

  const viewLatestVersionTargetId = React.useMemo(
    () => getViewLatestVersionTargetId(descriptor?.eservice.descriptors, descriptorId),
    [descriptor?.eservice.descriptors, descriptorId]
  )

  const { primaryAction, secondaryAction, menuActions, headerInfoActions } =
    useGetProviderEServiceActions(
      eserviceId,
      descriptor?.state,
      descriptor?.eservice.draftDescriptor?.state,
      descriptorId,
      descriptor?.eservice.draftDescriptor?.id,
      descriptor?.eservice.mode,
      descriptor?.eservice.name,
      descriptor?.templateRef?.isNewTemplateVersionAvailable ?? false,
      isEserviceFromTemplate,
      descriptor?.delegation,
      undefined,
      'detailsPage',
      undefined,
      viewLatestVersionTargetId,
      openVersionSelectorDrawer
    )

  return (
    <NewPageContainer
      title={descriptor?.eservice.name || ''}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      menuActions={menuActions}
      isLoading={!descriptor}
      backToAction={{
        label: t('actions.backToListLabel'),
        to: 'PROVIDE_ESERVICE_LIST',
      }}
      infoSection={
        descriptor
          ? {
              label: t('versionHeaderLabel'),
              shortcut: {
                type: 'button',
                label: descriptor.version,
                onClick: () =>
                  openDialog({
                    type: 'showEserviceVersionsList',
                    eserviceId,
                    eserviceName: descriptor.eservice.name,
                    descriptors: descriptor.eservice.descriptors,
                    routeKey: 'PROVIDE_ESERVICE_MANAGE',
                  }),
              },
              actions: headerInfoActions,
              statusChip: { for: 'descriptor', state: descriptor.state },
            }
          : undefined
      }
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
      {descriptor && (
        <EServiceVersionSelectorDrawer
          isOpen={isVersionSelectorDrawerOpen}
          onClose={closeVersionSelectorDrawer}
          descriptor={descriptor}
        />
      )}
    </NewPageContainer>
  )
}

export default ProviderEServiceDetailsPage

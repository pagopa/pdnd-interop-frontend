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
import {
  getActiveDescriptor,
  getViewLatestVersionTargetId,
  isDescriptorPendingArchiving,
} from '@/utils/eservice.utils'
import { ProviderEServiceDetailsAlerts } from './components/ProviderEServiceDetailsTab/ProviderEServiceDetailsAlerts'
import { AuthHooks } from '@/api/auth'
import { ProviderEServiceDelegatorArchivingAlert } from './components/ProviderEServiceDelegatorArchivingAlert'
import {
  PROVIDER_ESERVICE_MONITORING_TAB,
  ProviderEServiceMonitoringTab,
} from './components/ProviderEServiceMonitoringTab'

const ProviderEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })
  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { isAdmin, isSupport, isOperatorSecurity, isViewer } = AuthHooks.useJwt()

  const { activeTab, updateActiveTab } = useActiveTab('eserviceDetails')
  const canViewKeychains = isAdmin || isSupport || isOperatorSecurity
  // Monitoring is available to every role of this route (viewer included); keychains keep their
  // existing role restriction. Unknown or unauthorized `?tab=` values fall back to the details.
  const availableTabs = React.useMemo(
    () => [
      'eserviceDetails',
      PROVIDER_ESERVICE_MONITORING_TAB,
      ...(canViewKeychains ? ['keychains'] : []),
    ],
    [canViewKeychains]
  )
  const isActiveTabAvailable = availableTabs.includes(activeTab)
  const selectedTab = isActiveTabAvailable ? activeTab : 'eserviceDetails'
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

  React.useEffect(() => {
    if (!isActiveTabAvailable) {
      updateActiveTab(null, 'eserviceDetails')
    }
  }, [isActiveTabAvailable, updateActiveTab])

  const isEserviceFromTemplate = Boolean(descriptor?.templateRef)

  const viewLatestVersionTargetId = React.useMemo(
    () => getViewLatestVersionTargetId(descriptor?.eservice.descriptors, descriptorId, 'provider'),
    [descriptor?.eservice.descriptors, descriptorId]
  )

  const handleViewKeychains = () => {
    updateActiveTab(null, 'keychains')
  }

  const activeDescriptor = React.useMemo(
    () => getActiveDescriptor(descriptor?.eservice.descriptors),
    [descriptor?.eservice.descriptors]
  )

  const isActiveDescriptor = descriptor?.id === activeDescriptor?.id
  const isEServiceBeingArchived = isDescriptorPendingArchiving(activeDescriptor?.state)

  const hasMultipleVersions = (descriptor?.eservice.descriptors?.length ?? 0) > 1

  const isEServiceArchived = descriptor?.eservice.descriptors.every(
    (descriptor) => descriptor.state === 'ARCHIVED'
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
      descriptor?.eservice.personalData,
      'detailsPage',
      descriptor?.archivingSchedule,
      viewLatestVersionTargetId,
      hasMultipleVersions ? openVersionSelectorDrawer : undefined,
      isActiveDescriptor,
      isEServiceBeingArchived,
      descriptor?.eservice.delegatedArchivingRequest,
      isEServiceArchived
    )

  return (
    <NewPageContainer
      title={descriptor?.eservice.name || ''}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      menuActions={menuActions}
      isLoading={!descriptor}
      byDelegationChip={descriptor?.delegation ? { delegation: descriptor.delegation } : undefined}
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
                    activeDescriptor,
                    routeKey: 'PROVIDE_ESERVICE_MANAGE',
                  }),
              },
              actions: headerInfoActions,
              statusChip: {
                for: 'descriptor',
                state: descriptor.state,
                isActiveDescriptor,
              },
              archivingScheduleInfo:
                isDescriptorPendingArchiving(descriptor.state) &&
                descriptor.archivingSchedule?.archivableOn &&
                descriptor.archivingSchedule?.scope
                  ? {
                      archivableOn: descriptor.archivingSchedule.archivableOn,
                      scope: descriptor.archivingSchedule.scope,
                    }
                  : undefined,
            }
          : undefined
      }
    >
      <ProviderEServiceDetailsAlerts
        descriptor={descriptor}
        onViewKeychains={canViewKeychains ? handleViewKeychains : undefined}
      />
      {!isViewer && <ProviderEServiceDelegatorArchivingAlert descriptor={descriptor} />}
      <TabContext value={selectedTab}>
        <TabList onChange={updateActiveTab} aria-label={t('tabs.ariaLabel')} variant="fullWidth">
          <Tab label={t('tabs.eserviceDetails')} value="eserviceDetails" />
          <Tab label={t('tabs.monitoring')} value={PROVIDER_ESERVICE_MONITORING_TAB} />
          {canViewKeychains && <Tab label={t('tabs.keychain')} value="keychains" />}
        </TabList>

        <TabPanel value="eserviceDetails">
          <ProviderEserviceDetailsTab />
        </TabPanel>

        <TabPanel value={PROVIDER_ESERVICE_MONITORING_TAB}>
          <ProviderEServiceMonitoringTab />
        </TabPanel>

        {canViewKeychains && (
          <TabPanel value="keychains">
            <ProviderEserviceKeychainsTab />
          </TabPanel>
        )}
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

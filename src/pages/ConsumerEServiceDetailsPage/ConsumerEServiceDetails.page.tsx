import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { useNavigate, useParams } from '@/router'
import { useTranslation } from 'react-i18next'
import { Tab, useTheme } from '@mui/material'
import { useTrackPageViewEvent } from '@/config/tracking'
import { useQuery } from '@tanstack/react-query'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useActiveTab } from '@/hooks/useActiveTab'
import { useMarkNotificationsAsRead } from '@/hooks/useMarkNotificationsAsRead'
import { NewPageContainer } from '@/components/layout/containers/NewPageContainer'
import { useDialog } from '@/stores'
import { getViewLatestVersionTargetId, isDescriptorPendingArchiving } from '@/utils/eservice.utils'
import { ConsumerEServiceDetailsAlerts } from './components/ConsumerEServiceDetailsAlerts'
import GeneralInfoTab from './components/GeneralInfoTab'
import PurposeTemplatesTab from './components/PurposeTemplatesTab'
import TechnicalSpecsTab from './components/TechnicalSpecsTab'
import EntryRequirementsTab from './components/EntryRequirementsTab'
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled'
import { useActions } from './hooks/useActions'

const ConsumerEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'consumer.detail' })
  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const theme = useTheme()
  const navigate = useNavigate()

  const { activeTab, updateActiveTab } = useActiveTab('generalInfo')
  const { openDialog } = useDialog()

  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  useMarkNotificationsAsRead(`${eserviceId}/${descriptorId}`)

  const viewLatestVersionTargetId = React.useMemo(
    () => getViewLatestVersionTargetId(descriptor?.eservice.descriptors, descriptorId, 'consumer'),
    [descriptor?.eservice.descriptors, descriptorId]
  )

  const { primary, secondary, menu } = useActions()

  useTrackPageViewEvent('INTEROP_CATALOG_READ', {
    eserviceId: descriptor?.eservice.id,
    descriptorId: descriptor?.id,
  })

  const handleViewLatestVersion = () => {
    if (descriptor && viewLatestVersionTargetId) {
      navigate('SUBSCRIBE_CATALOG_VIEW', {
        params: { eserviceId: descriptor?.eservice.id, descriptorId: viewLatestVersionTargetId },
      })
    }
  }

  return (
    <NewPageContainer
      title={descriptor?.eservice.name || ''}
      primaryAction={primary}
      secondaryAction={secondary}
      menuActions={menu}
      isLoading={!descriptor}
      infoSection={
        descriptor
          ? {
              label: t('version'),
              shortcut: {
                type: 'button',
                label: descriptor.version,
                onClick: () =>
                  openDialog({
                    type: 'showEserviceVersionsList',
                    eserviceId,
                    eserviceName: descriptor.eservice.name,
                    descriptors: descriptor.eservice.descriptors,
                    activeDescriptor: descriptor.eservice.activeDescriptor,
                    routeKey: 'SUBSCRIBE_CATALOG_VIEW',
                  }),
              },
              actions: viewLatestVersionTargetId
                ? [
                    {
                      action: handleViewLatestVersion,
                      label: t('actions.version.change'),
                      icon: ReplayCircleFilledIcon,
                    },
                  ]
                : [],
              statusChip: {
                for: 'descriptor',
                state: descriptor.state,
                isActiveDescriptor: descriptor.id === descriptor.eservice.activeDescriptor?.id,
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
      <ConsumerEServiceDetailsAlerts descriptor={descriptor} />
      <TabContext value={activeTab}>
        <TabList
          sx={{
            '& .MuiTab-root.Mui-selected': {
              color: theme.colors.blue[500],
              borderBottomColor: theme.colors.blue[500],
            },
          }}
          onChange={updateActiveTab}
          aria-label={t('tabs.ariaLabel')}
          variant="fullWidth"
        >
          <Tab label={t('tabs.generalInfo')} value="generalInfo" />
          <Tab label={t('tabs.entryRequirements')} value="entryRequirements" />
          <Tab label={t('tabs.technicalSpecs')} value="technicalSpecs" />
          <Tab label={t('tabs.purposeTemplates')} value="purposeTemplates" />
        </TabList>

        <TabPanel value="generalInfo">
          <GeneralInfoTab />
        </TabPanel>
        <TabPanel value="entryRequirements">
          <EntryRequirementsTab />
        </TabPanel>
        <TabPanel value="technicalSpecs">
          <TechnicalSpecsTab />
        </TabPanel>
        <TabPanel value="purposeTemplates">
          <PurposeTemplatesTab />
        </TabPanel>
      </TabContext>
    </NewPageContainer>
  )
}

export default ConsumerEServiceDetailsPage

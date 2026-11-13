import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import useGetEServiceConsumerActions from '@/hooks/useGetEServiceConsumerActions'
import { useParams } from '@/router'
import { useTranslation } from 'react-i18next'
import { Tab, useTheme } from '@mui/material'
import { useTrackPageViewEvent } from '@/config/tracking'
import { useQuery } from '@tanstack/react-query'
import { DelegationQueries } from '@/api/delegation'
import { AuthHooks } from '@/api/auth'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useActiveTab } from '@/hooks/useActiveTab'
import { useMarkNotificationsAsRead } from '@/hooks/useMarkNotificationsAsRead'
import { NewPageContainer } from '@/components/layout/containers/NewPageContainer'
import { useDialog } from '@/stores'
import { getViewLatestVersionTargetId, isDescriptorPendingArchiving } from '@/utils/eservice.utils'
import { ConsumerEServiceDetailsAlerts } from './components/ConsumerEServiceDetailsAlerts'
import { useRequesterEserviceAgreement } from './hooks/useRequesterEserviceAgreement'
import GeneralInfoTab from './components/GeneralInfoTab'
import PurposeTemplatesTab from './components/PurposeTemplatesTab'
import TechnicalSpecsTab from './components/TechnicalSpecsTab'
import EntryRequirementsTab from './components/EntryRequirementsTab'

const ConsumerEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'consumer.detail' })
  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { jwt, isReviewer } = AuthHooks.useJwt()
  const theme = useTheme()

  const { activeTab, updateActiveTab } = useActiveTab('generalInfo')
  const { openDialog } = useDialog()

  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  useMarkNotificationsAsRead(`${eserviceId}/${descriptorId}`)

  const { data: delegators } = useQuery({
    ...DelegationQueries.getConsumerDelegators({
      limit: 50,
      offset: 0,
      eserviceIds: [eserviceId],
    }),
    enabled: Boolean(jwt?.organizationId) && !isReviewer,
    select: ({ results }) => results ?? [],
  })

  const { data: delegations = [] } = useQuery({
    ...DelegationQueries.getList({
      limit: 50,
      offset: 0,
      eserviceIds: [eserviceId],
      kind: 'DELEGATED_CONSUMER',
      states: ['ACTIVE'],
      delegatorIds: [jwt?.organizationId as string],
    }),
    enabled: Boolean(jwt?.organizationId) && !isReviewer,
    select: ({ results }) => results ?? [],
  })

  const isDelegator = delegations.length > 0

  const viewLatestVersionTargetId = React.useMemo(
    () => getViewLatestVersionTargetId(descriptor?.eservice.descriptors, descriptorId, 'consumer'),
    [descriptor?.eservice.descriptors, descriptorId]
  )

  const requesterEserviceAgreement = useRequesterEserviceAgreement({
    eserviceId,
    activeDescriptorId: descriptor?.eservice.activeDescriptor?.id,
    requesterTenantId: jwt?.organizationId,
    isReviewer,
  })

  const { primaryAction, secondaryAction, menuActions, headerInfoActions } =
    useGetEServiceConsumerActions(
      descriptor,
      delegators,
      isDelegator,
      viewLatestVersionTargetId,
      requesterEserviceAgreement
    )

  useTrackPageViewEvent('INTEROP_CATALOG_READ', {
    eserviceId: descriptor?.eservice.id,
    descriptorId: descriptor?.id,
  })

  return (
    <NewPageContainer
      title={descriptor?.eservice.name || ''}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      menuActions={menuActions}
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
              actions: headerInfoActions,
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

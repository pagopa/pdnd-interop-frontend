import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import useGetEServiceConsumerActions from '@/hooks/useGetEServiceConsumerActions'
import { useParams } from '@/router'
import { useTranslation } from 'react-i18next'
import { Tab } from '@mui/material'
import { useTrackPageViewEvent } from '@/config/tracking'
import { useQuery } from '@tanstack/react-query'
import { DelegationQueries } from '@/api/delegation'
import { AuthHooks } from '@/api/auth'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useActiveTab } from '@/hooks/useActiveTab'
import ConsumerEServiceDetailsTab from './components/ConsumerEServiceDetailsTab/ConsumerEServiceDetailsTab'
import ConsumerLinkedPurposeTemplatesTab from './components/ConsumerLinkedPurposeTemplatesTab.tsx/ConsumerLinkedPurposeTemplatesTab'
import { useMarkNotificationsAsRead } from '@/hooks/useMarkNotificationsAsRead'
import { NewPageContainer } from '@/components/layout/containers/NewPageContainer'
import { useDialog } from '@/stores'
import { getViewLatestVersionTargetId } from '@/utils/eservice.utils'
import { ConsumerEServiceDetailsAlerts } from './components/ConsumerEServiceDetailsTab/ConsumerEServiceDetailsAlerts'

const ConsumerEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })
  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { jwt, isReviewer } = AuthHooks.useJwt()

  const { activeTab, updateActiveTab } = useActiveTab('eserviceDetail')
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
    () => getViewLatestVersionTargetId(descriptor?.eservice.descriptors, descriptorId),
    [descriptor?.eservice.descriptors, descriptorId]
  )

  const { primaryAction, secondaryAction, menuActions, headerInfoActions } =
    useGetEServiceConsumerActions(descriptor, delegators, isDelegator, viewLatestVersionTargetId)

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
      backToAction={{
        label: t('actions.backToCatalogLabel'),
        to: 'SUBSCRIBE_CATALOG_LIST',
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
                descriptor.archivingSchedule?.archivableOn && descriptor.archivingSchedule?.scope
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
      {isReviewer ? (
        <ConsumerEServiceDetailsTab />
      ) : (
        <TabContext value={activeTab}>
          <TabList
            onChange={updateActiveTab}
            aria-label={t('tabs.ariaLabelEserviceDetail')}
            variant="fullWidth"
          >
            <Tab label={t('tabs.eserviceDetail')} value="eserviceDetail" />
            <Tab label={t('tabs.purposeTemplate')} value="linkedPurposeTemplates" />
          </TabList>

          <TabPanel value="eserviceDetail">
            <ConsumerEServiceDetailsTab />
          </TabPanel>

          <TabPanel value="linkedPurposeTemplates">
            <ConsumerLinkedPurposeTemplatesTab />
          </TabPanel>
        </TabContext>
      )}
    </NewPageContainer>
  )
}

export default ConsumerEServiceDetailsPage

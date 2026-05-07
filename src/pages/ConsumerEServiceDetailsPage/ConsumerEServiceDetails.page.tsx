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

const ConsumerEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })
  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { jwt } = AuthHooks.useJwt()

  const { activeTab, updateActiveTab } = useActiveTab('eserviceDetail')

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
    enabled: Boolean(jwt?.organizationId),
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
    enabled: Boolean(jwt?.organizationId),
    select: ({ results }) => results ?? [],
  })

  const isDelegator = delegations.length > 0

  const { actions } = useGetEServiceConsumerActions(descriptor, delegators, isDelegator)

  useTrackPageViewEvent('INTEROP_CATALOG_READ', {
    eserviceId: descriptor?.eservice.id,
    descriptorId: descriptor?.id,
  })

  return (
    <NewPageContainer
      title={descriptor?.eservice.name || ''}
      topSideActions={actions}
      isLoading={!descriptor}
      backToAction={{
        label: t('actions.backToCatalogLabel'),
        to: 'SUBSCRIBE_CATALOG_LIST',
      }}
      infoSection={
        descriptor
          ? {
              label: t('versionHeaderLabel'),
              link: { label: descriptor.version, onClick: () => {} }, // TODO navigation function,
              // // TODO actions for secondHeader
              statusChip: { for: 'eservice', state: descriptor.state },
            }
          : undefined
      }
    >
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
    </NewPageContainer>
  )
}

export default ConsumerEServiceDetailsPage

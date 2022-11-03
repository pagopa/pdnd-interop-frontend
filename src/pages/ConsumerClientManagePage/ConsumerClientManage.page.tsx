import { ClientMutations, ClientQueries } from '@/api/client'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { PageContainerSkeleton } from '@/components/layout/containers/PageContainer'
import { RouterLink, useRouteParams } from '@/router'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { VoucherInstructions, VoucherInstructionsSkeleton } from './components/VoucherInstructions'
import { useClientKind } from './hooks/useClientKind'
import { formatTopSideActions } from '@/utils/common.utils'

const ConsumerClientManagePage: React.FC = () => {
  return (
    <React.Suspense fallback={<ConsumerClientManagePageSkeleton />}>
      <ConsumerClientManagePageContent />
    </React.Suspense>
  )
}

const ConsumerClientManagePageContent: React.FC = () => {
  const { t } = useTranslation('client', { keyPrefix: 'edit' })
  const { clientId } = useRouteParams<
    'SUBSCRIBE_CLIENT_EDIT' | 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT'
  >()
  const clientKind = useClientKind()
  const { activeTab, updateActiveTab } = useActiveTab('voucher')
  const { data: client } = ClientQueries.useGetSingle(clientId)
  const { mutate: deleteClient } = ClientMutations.useDelete()

  const topSideActions = formatTopSideActions(
    [{ label: t('actions.deleteLabel'), action: deleteClient.bind(null, { clientId }) }],
    { variant: 'contained' }
  )

  return (
    <PageContainer
      title={client?.name ?? ''}
      description={client?.description}
      topSideActions={topSideActions}
    >
      <TabContext value={activeTab}>
        <TabList onChange={updateActiveTab} aria-label={t('tabs.ariaLabel')} variant="fullWidth">
          <Tab label={t('tabs.voucher')} value="voucher" />
          <Tab label={t('tabs.clientMembers')} value="clientMembers" />
          <Tab label={t('tabs.publicKeys')} value="publicKeys" />
        </TabList>

        <TabPanel value="voucher">
          <React.Suspense fallback={<VoucherInstructionsSkeleton />}>
            <VoucherInstructions clientId={clientId} />
          </React.Suspense>
        </TabPanel>

        <TabPanel value="clientMembers"></TabPanel>

        <TabPanel value="publicKeys"></TabPanel>
      </TabContext>
      <PageBottomActionsContainer>
        <RouterLink
          as="button"
          variant="outlined"
          to={clientKind === 'CONSUMER' ? 'SUBSCRIBE_INTEROP_M2M' : 'SUBSCRIBE_CLIENT_LIST'}
          options={{ urlParams: clientKind === 'CONSUMER' ? { tab: 'clients' } : {} }}
        >
          {t('actions.backToClientsLabel')}
        </RouterLink>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

const ConsumerClientManagePageSkeleton: React.FC = () => {
  return <PageContainerSkeleton>todo</PageContainerSkeleton>
}

export default ConsumerClientManagePage

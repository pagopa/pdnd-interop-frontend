import { ClientQueries } from '@/api/client'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { Link, useParams } from '@/router'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { VoucherInstructions, VoucherInstructionsSkeleton } from './components/VoucherInstructions'
import { useClientKind } from '@/hooks/useClientKind'
import { formatTopSideActions } from '@/utils/common.utils'
import { ClientOperators } from './components/ClientOperators'
import { ClientPublicKeys } from './components/ClientPublicKeys'
import useGetClientActions from '@/hooks/useGetClientActions'

const ConsumerClientManagePage: React.FC = () => {
  const { t } = useTranslation('client', { keyPrefix: 'edit' })
  const { clientId } = useParams<'SUBSCRIBE_CLIENT_EDIT' | 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT'>()
  const clientKind = useClientKind()
  const { activeTab, updateActiveTab } = useActiveTab('voucher')
  const { data: client, isLoading: isLoadingClient } = ClientQueries.useGetSingle(clientId, {
    suspense: false,
  })

  const { actions } = useGetClientActions(client)

  const topSideActions = formatTopSideActions(actions, { variant: 'outlined' })

  return (
    <PageContainer
      title={client?.name ?? ''}
      description={client?.description}
      topSideActions={topSideActions}
      isLoading={isLoadingClient}
    >
      <TabContext value={activeTab}>
        <TabList onChange={updateActiveTab} aria-label={t('tabs.ariaLabel')} variant="fullWidth">
          <Tab label={t('tabs.voucher')} value="voucher" />
          <Tab label={t('tabs.clientOperators')} value="clientOperators" />
          <Tab label={t('tabs.publicKeys')} value="publicKeys" />
        </TabList>

        <TabPanel value="voucher">
          <React.Suspense fallback={<VoucherInstructionsSkeleton />}>
            <VoucherInstructions clientId={clientId} />
          </React.Suspense>
        </TabPanel>

        <TabPanel value="clientOperators">
          <ClientOperators clientId={clientId} />
        </TabPanel>

        <TabPanel value="publicKeys">
          <ClientPublicKeys clientId={clientId} />
        </TabPanel>
      </TabContext>
      <PageBottomActionsContainer>
        <Link
          as="button"
          variant="outlined"
          to={clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M' : 'SUBSCRIBE_CLIENT_LIST'}
        >
          {t('actions.backToClientsLabel')}
        </Link>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

export default ConsumerClientManagePage

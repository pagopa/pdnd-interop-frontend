import { ClientQueries } from '@/api/client'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { VoucherInstructions } from './components/VoucherInstructions'
import { useClientKind } from '@/hooks/useClientKind'
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

  return (
    <PageContainer
      title={client?.name ?? ''}
      description={client?.description}
      newTopSideActions={actions}
      isLoading={isLoadingClient}
      backToAction={{
        label: t('actions.backToClientsLabel'),
        to: clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M' : 'SUBSCRIBE_CLIENT_LIST',
      }}
    >
      <TabContext value={activeTab}>
        <TabList onChange={updateActiveTab} aria-label={t('tabs.ariaLabel')} variant="fullWidth">
          <Tab label={t('tabs.voucher')} value="voucher" />
          <Tab label={t('tabs.clientOperators')} value="clientOperators" />
          <Tab label={t('tabs.publicKeys')} value="publicKeys" />
        </TabList>

        <TabPanel value="voucher">
          <VoucherInstructions clientId={clientId} />
        </TabPanel>

        <TabPanel value="clientOperators">
          <ClientOperators clientId={clientId} />
        </TabPanel>

        <TabPanel value="publicKeys">
          <ClientPublicKeys clientId={clientId} />
        </TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default ConsumerClientManagePage

import { PageContainer } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import type { ActionItemButton } from '@/types/common.types'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import { KeychainMembersTab } from './components/KeychainMembersTab/KeychainMembersTab'
import { KeychainPublicKeysTab } from './components/KeychainPublicKeysTab/KeychainPublicKeysTab'
import { useQuery } from '@tanstack/react-query'
import { KeychainQueries } from '@/api/keychain/keychain.queries'
import { KeychainMutations } from '@/api/keychain/keychain.mutations'
import { useNavigate } from '@/router'
import { useParams } from '@/router'
import { AuthHooks } from '@/api/auth'

const ProviderKeychainDetailsPage: React.FC = () => {
  const { t } = useTranslation('keychain')
  const { t: tCommon } = useTranslation('common')
  const { activeTab, updateActiveTab } = useActiveTab('members')
  const navigate = useNavigate()

  const { keychainId } = useParams<'PROVIDE_KEYCHAIN_DETAILS'>()

  const { mutate: deleteKeychain } = KeychainMutations.useDeleteKeychain()

  const { data: keychain, isLoading: isLoadingKeychain } = useQuery(
    KeychainQueries.getSingle(keychainId)
  )

  const { isAdmin } = AuthHooks.useJwt()

  const actions: ActionItemButton[] = isAdmin
    ? [
        {
          label: tCommon('actions.delete'),
          action: () => {
            deleteKeychain(
              { producerKeychainId: keychainId },
              { onSuccess: () => navigate('PROVIDE_KEYCHAINS_LIST') }
            )
          },
          color: 'error',
          icon: DeleteIcon,
          variant: 'naked',
        },
      ]
    : []

  return (
    <PageContainer
      title={keychain?.name ?? ''}
      topSideActions={actions}
      isLoading={isLoadingKeychain}
      backToAction={{
        label: t('actions.backToKeychainsListLabel'),
        to: 'SUBSCRIBE_CATALOG_LIST',
      }}
    >
      <TabContext value={activeTab}>
        <TabList onChange={updateActiveTab} aria-label={t('tabs.ariaLabel')} variant="fullWidth">
          <Tab label={t('tabs.members')} value="members" />
          <Tab label={t('tabs.publicKeys')} value="publicKeys" />
        </TabList>

        <TabPanel value="members">
          <KeychainMembersTab keychainId={keychainId} />
        </TabPanel>

        <TabPanel value="publicKeys">
          <KeychainPublicKeysTab keychainId={keychainId} />
        </TabPanel>
      </TabContext>
    </PageContainer>
  )
}

export default ProviderKeychainDetailsPage

import { PageContainer } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import type { ActionItem } from '@/types/common.types'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Stack, Tab, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import { KeychainMembersTab } from './components/KeychainMembersTab/KeychainMembersTab'
import { KeychainPublicKeysTab } from './components/KeychainPublicKeysTab/KeychainPublicKeysTab'
import { useQuery } from '@tanstack/react-query'
import { KeychainQueries } from '@/api/keychain/keychain.queries'
import { KeychainMutations } from '@/api/keychain/keychain.mutations'
import { useMarkNotificationsAsRead } from '@/hooks/useMarkNotificationsAsRead'
import { useNavigate } from '@/router'
import { useParams } from '@/router'
import { AuthHooks } from '@/api/auth'
import EditIcon from '@mui/icons-material/Edit'
import { ActionMenu } from '@/components/shared/ActionMenu'
import { UpdateMetadataDrawer } from '@/components/shared/UpdateMetadataDrawer'
import { useDrawerState } from '@/hooks/useDrawerState'

const ProviderKeychainDetailsPage: React.FC = () => {
  const { t } = useTranslation('keychain')
  const { t: tCommon } = useTranslation('common')
  const { activeTab, updateActiveTab } = useActiveTab('members')
  const navigate = useNavigate()
  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const { keychainId } = useParams<'PROVIDE_KEYCHAIN_DETAILS'>()

  const { mutate: deleteKeychain } = KeychainMutations.useDeleteKeychain()

  const { data: keychain, isLoading: isLoadingKeychain } = useQuery(
    KeychainQueries.getSingle(keychainId)
  )

  useMarkNotificationsAsRead(keychainId)

  const { isAdmin } = AuthHooks.useJwt()

  const actions: ActionItem[] = isAdmin
    ? [
        {
          label: tCommon('actions.delete'),
          action: () => {
            deleteKeychain(
              { producerKeychainId: keychainId },
              { onSuccess: () => navigate('PROVIDE_KEYCHAINS_LIST') }
            )
          },
          icon: DeleteIcon,
        },
        {
          label: t('updateMetadataDrawer.title'),
          action: openDrawer,
          icon: EditIcon,
        },
      ]
    : []

  return (
    <PageContainer
      description={
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography component="h1" variant="h4" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
              {keychain?.name ?? ''}
            </Typography>
            {isAdmin && keychain && <ActionMenu actions={actions} hasIconBorder />}
          </Stack>
          <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
            {keychain?.description ?? ''}
          </Typography>
        </Stack>
      }
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
      {isAdmin && keychain && (
        <UpdateMetadataDrawer
          isOpen={isOpen}
          onClose={closeDrawer}
          title={t('updateMetadataDrawer.title')}
          description={t('updateMetadataDrawer.description')}
          nameField={{
            label: t('updateMetadataDrawer.nameField.label'),
            helperText: t('updateMetadataDrawer.nameField.helperText'),
            validation: { required: true, minLength: 5, maxLength: 60 },
          }}
          descriptionField={{
            label: t('updateMetadataDrawer.descriptionField.label'),
            helperText: t('updateMetadataDrawer.descriptionField.helperText'),
            validation: { required: true, minLength: 10, maxLength: 250 },
          }}
          initialValues={{ name: keychain.name, description: keychain.description }}
          onSubmit={() => null}
        />
      )}
    </PageContainer>
  )
}

export default ProviderKeychainDetailsPage

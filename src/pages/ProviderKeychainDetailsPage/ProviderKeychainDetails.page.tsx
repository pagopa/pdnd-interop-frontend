import { PageContainer } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { IconButton, Stack, Tab, Typography } from '@mui/material'
import { MIMenu } from '@pagopa/mui-italia'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { KeychainMembersTab } from './components/KeychainMembersTab/KeychainMembersTab'
import { KeychainPublicKeysTab } from './components/KeychainPublicKeysTab/KeychainPublicKeysTab'
import { useQuery } from '@tanstack/react-query'
import { KeychainQueries } from '@/api/keychain/keychain.queries'
import { KeychainMutations } from '@/api/keychain/keychain.mutations'
import { useMarkNotificationsAsRead } from '@/hooks/useMarkNotificationsAsRead'
import { useNavigate } from '@/router'
import { useParams } from '@/router'
import { AuthHooks } from '@/api/auth'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  UpdateMetadataDrawer,
  type UpdateMetadataFormValues,
} from '@/components/shared/UpdateMetadataDrawer'
import { useDrawerState } from '@/hooks/useDrawerState'

const ProviderKeychainDetailsPage: React.FC = () => {
  const { t } = useTranslation('keychain')
  const { t: tCommon } = useTranslation('common')
  const { t: tActionMenu } = useTranslation('shared-components', { keyPrefix: 'actionMenu' })
  const { activeTab, updateActiveTab } = useActiveTab('members')
  const navigate = useNavigate()
  const { isOpen, openDrawer, closeDrawer } = useDrawerState()
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null)
  const menuId = React.useId()
  const menuButtonId = `${menuId}-button`

  const { keychainId } = useParams<'PROVIDE_KEYCHAIN_DETAILS'>()

  const { mutate: deleteKeychain } = KeychainMutations.useDeleteKeychain()
  const { mutate: updateKeychain } = KeychainMutations.useUpdateKeychain()

  const { data: keychain, isLoading: isLoadingKeychain } = useQuery(
    KeychainQueries.getSingle(keychainId)
  )

  useMarkNotificationsAsRead(keychainId)

  const { isAdmin } = AuthHooks.useJwt()

  const handleMetadataUpdate = (payload: UpdateMetadataFormValues) => {
    if (!keychain) return
    const changedName = payload.name !== keychain.name
    const changedDescription = payload.description !== keychain.description
    if (!changedName && !changedDescription) return

    updateKeychain(
      {
        producerKeychainId: keychainId,
        ...(changedName
          ? {
              name: payload.name,
              ...(changedDescription ? { description: payload.description } : {}),
            }
          : { description: payload.description }),
      },
      { onSuccess: closeDrawer }
    )
  }

  return (
    <PageContainer
      description={
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography component="h1" variant="h4" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
              {keychain?.name ?? ''}
            </Typography>
            {isAdmin && keychain && (
              <>
                <IconButton
                  id={menuButtonId}
                  aria-label={tActionMenu('iconButtonAriaLabel')}
                  aria-controls={menuAnchor ? menuId : undefined}
                  aria-expanded={menuAnchor ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={(event) => setMenuAnchor(event.currentTarget)}
                  sx={{ border: 2, borderRadius: 1 }}
                >
                  <MoreVertIcon color="primary" fontSize="small" sx={{ mx: 0.5 }} />
                </IconButton>
                <MIMenu
                  id={menuId}
                  open={Boolean(menuAnchor)}
                  anchorEl={menuAnchor}
                  onClose={() => setMenuAnchor(null)}
                  MenuListProps={{ 'aria-labelledby': menuButtonId }}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  items={[
                    {
                      id: 'edit',
                      label: t('updateMetadataDrawer.title'),
                      onClick: () => {
                        setMenuAnchor(null)
                        openDrawer()
                      },
                    },
                    {
                      id: 'delete',
                      label: tCommon('actions.delete'),
                      onClick: () => {
                        setMenuAnchor(null)
                        deleteKeychain(
                          { producerKeychainId: keychainId },
                          { onSuccess: () => navigate('PROVIDE_KEYCHAINS_LIST') }
                        )
                      },
                    },
                  ]}
                />
              </>
            )}
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
          onSubmit={handleMetadataUpdate}
        />
      )}
    </PageContainer>
  )
}

export default ProviderKeychainDetailsPage

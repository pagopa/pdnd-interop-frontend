import { ClientMutations, ClientQueries } from '@/api/client'
import { PageContainer, SectionContainer } from '@/components/layout/containers'
import { useParams, useNavigate } from '@/router'
import { useActiveTab } from '@/hooks/useActiveTab'
import { useMarkNotificationsAsRead } from '@/hooks/useMarkNotificationsAsRead'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Button, Grid, Stack, Tab, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'
import { ClientOperators } from './components/ClientOperators'
import { ClientPublicKeys } from './components/ClientPublicKeys'
import useGetClientActions from '@/hooks/useGetClientActions'
import { useQuery } from '@tanstack/react-query'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import SyncIcon from '@mui/icons-material/Sync'
import { useDrawerState } from '@/hooks/useDrawerState'
import { SetClientAdminDrawer } from './components/SetClientAdminDrawer/SetClientAdminDrawer'
import type { ActionItem } from '@/types/common.types'
import { useSearchParams } from 'react-router-dom'
import { AuthHooks } from '@/api/auth'
import EditIcon from '@mui/icons-material/Edit'
import { ActionMenu } from '@/components/shared/ActionMenu'
import { UpdateMetadataDrawer } from '@/components/shared/UpdateMetadataDrawer'

const ConsumerClientManagePage: React.FC = () => {
  const { t } = useTranslation('client', { keyPrefix: 'edit' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { clientId } = useParams<'SUBSCRIBE_CLIENT_EDIT' | 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT'>()
  const [searchParams] = useSearchParams()
  const purposeId = searchParams.get('purposeId')
  const clientKind = useClientKind()
  const { activeTab, updateActiveTab } = useActiveTab('clientOperators')
  const navigate = useNavigate()
  const { isAdmin } = AuthHooks.useJwt()

  const { data: client, isLoading: isLoadingClient } = useQuery(ClientQueries.getSingle(clientId))

  const { actions } = useGetClientActions(client)

  useMarkNotificationsAsRead(clientId)

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()
  const {
    isOpen: isMetadataDrawerOpen,
    openDrawer: openMetadataDrawer,
    closeDrawer: closeMetadataDrawer,
  } = useDrawerState()
  const { mutate: removeClientAdmin } = ClientMutations.useRemoveClientAdmin()

  const handleRemoveClientAdmin = () => {
    if (!client?.admin) return
    removeClientAdmin({
      clientId: client.id,
      adminId: client.admin.userId,
      userName: `${client.admin.name} ${client.admin.familyName}`,
    })
  }

  const handleVoucherSimulation = () =>
    navigate(clientKind === 'API' ? 'SIMULATE_GET_VOUCHER_API' : 'SIMULATE_GET_VOUCHER_CONSUMER', {
      urlParams: { clientId, ...(purposeId ? { purposeId } : {}) },
    })

  const menuActions: ActionItem[] =
    isAdmin && client
      ? [
          ...actions,
          {
            label: t('updateMetadataDrawer.title'),
            action: openMetadataDrawer,
            icon: EditIcon,
          },
        ]
      : []

  return (
    <PageContainer
      description={
        <Stack spacing={1}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
            <Typography component="h1" variant="h4" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
              {client?.name ?? ''}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="stretch" sx={{ flexShrink: 0 }}>
              <Button variant="contained" onClick={handleVoucherSimulation}>
                {tCommon('simulateVoucher')}
              </Button>
              {menuActions.length > 0 && <ActionMenu actions={menuActions} hasIconBorder />}
            </Stack>
          </Stack>
          <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
            {client?.description ?? ''}
          </Typography>
        </Stack>
      }
      isLoading={isLoadingClient}
      backToAction={{
        label: t('actions.backToClientsLabel'),
        to: clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M' : 'SUBSCRIBE_CLIENT_LIST',
      }}
    >
      {clientKind === 'API' && (
        <Grid container>
          <Grid item xs={8}>
            <SectionContainer
              title={t('adminSection.title')}
              description={t('adminSection.description')}
              sx={{ mb: 3 }}
            >
              {client?.admin ? (
                <Stack direction="row" justifyContent="space-between" alignItems={'center'}>
                  <InformationContainer
                    label={t('adminSection.adminLabel')}
                    content={`${client.admin.name} ${client.admin.familyName}`}
                    direction="column"
                  />
                  {isAdmin && (
                    <Stack direction="row" spacing={2}>
                      <Button variant="outlined" startIcon={<SyncIcon />} onClick={openDrawer}>
                        {t('adminSection.actions.substituteAdminLabel')}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleRemoveClientAdmin}
                      >
                        {t('adminSection.actions.removeAdminLabel')}
                      </Button>
                    </Stack>
                  )}
                </Stack>
              ) : isAdmin ? (
                <Button variant="outlined" onClick={openDrawer}>
                  {t('adminSection.actions.selectAdminLabel')}
                </Button>
              ) : null}
            </SectionContainer>
          </Grid>
        </Grid>
      )}
      <TabContext value={activeTab}>
        <TabList onChange={updateActiveTab} aria-label={t('tabs.ariaLabel')} variant="fullWidth">
          <Tab label={t('tabs.clientOperators')} value="clientOperators" />
          <Tab label={t('tabs.publicKeys')} value="publicKeys" />
        </TabList>

        <TabPanel value="clientOperators">
          <ClientOperators clientId={clientId} />
        </TabPanel>

        <TabPanel value="publicKeys">
          <ClientPublicKeys clientId={clientId} />
        </TabPanel>
      </TabContext>
      {clientKind === 'API' && isAdmin && (
        <SetClientAdminDrawer
          isOpen={isOpen}
          onClose={closeDrawer}
          clientId={clientId}
          admin={client?.admin}
        />
      )}
      {isAdmin && client && (
        <UpdateMetadataDrawer
          isOpen={isMetadataDrawerOpen}
          onClose={closeMetadataDrawer}
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
          initialValues={{ name: client.name, description: client.description ?? '' }}
          onSubmit={() => null}
        />
      )}
    </PageContainer>
  )
}

export default ConsumerClientManagePage

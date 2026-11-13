import { ClientMutations, ClientQueries } from '@/api/client'
import { PageContainer, SectionContainer } from '@/components/layout/containers'
import { useParams, useNavigate } from '@/router'
import { useActiveTab } from '@/hooks/useActiveTab'
import { useMarkNotificationsAsRead } from '@/hooks/useMarkNotificationsAsRead'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Button, Grid, IconButton, Stack, Tab, Typography } from '@mui/material'
import { MIMenu } from '@pagopa/mui-italia'
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
import { useSearchParams } from 'react-router-dom'
import { AuthHooks } from '@/api/auth'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  UpdateMetadataDrawer,
  type UpdateMetadataFormValues,
} from '@/components/shared/UpdateMetadataDrawer'

const ConsumerClientManagePage: React.FC = () => {
  const { t } = useTranslation('client', { keyPrefix: 'edit' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t: tActionMenu } = useTranslation('shared-components', { keyPrefix: 'actionMenu' })
  const { clientId } = useParams<'SUBSCRIBE_CLIENT_EDIT' | 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT'>()
  const [searchParams] = useSearchParams()
  const purposeId = searchParams.get('purposeId')
  const clientKind = useClientKind()
  const { activeTab, updateActiveTab } = useActiveTab('clientOperators')
  const navigate = useNavigate()
  const { isAdmin } = AuthHooks.useJwt()
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null)
  const menuId = React.useId()
  const menuButtonId = `${menuId}-button`

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
  const { mutate: updateClient } = ClientMutations.useUpdateClient()

  const handleMetadataUpdate = (values: UpdateMetadataFormValues) => {
    if (!client) return
    const changedName = values.name !== client.name
    const changedDescription = values.description !== (client.description ?? '')
    if (!changedName && !changedDescription) return

    updateClient(
      {
        clientId: client.id,
        ...(changedName
          ? {
              name: values.name,
              ...(changedDescription ? { description: values.description } : {}),
            }
          : { description: values.description }),
      },
      { onSuccess: closeMetadataDrawer }
    )
  }

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

  return (
    <PageContainer
      description={
        <Stack spacing={1}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
            <Typography component="h1" variant="h4" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
              {client?.name ?? ''}
            </Typography>
            <Stack direction="row" spacing={4} alignItems="stretch" sx={{ flexShrink: 0 }}>
              <Button variant="contained" onClick={handleVoucherSimulation}>
                {tCommon('simulateVoucher')}
              </Button>
              {isAdmin && client && (
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
                        id: 'edit-metadata',
                        label: t('updateMetadataDrawer.title'),
                        onClick: () => {
                          setMenuAnchor(null)
                          openMetadataDrawer()
                        },
                      },
                      ...actions.map(({ label, action }) => ({
                        id: label,
                        label,
                        onClick: () => {
                          setMenuAnchor(null)
                          action()
                        },
                      })),
                    ]}
                  />
                </>
              )}
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
          onSubmit={handleMetadataUpdate}
        />
      )}
    </PageContainer>
  )
}

export default ConsumerClientManagePage

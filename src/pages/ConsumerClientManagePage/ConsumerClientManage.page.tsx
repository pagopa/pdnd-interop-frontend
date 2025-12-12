import { ClientMutations, ClientQueries } from '@/api/client'
import { PageContainer, SectionContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { useActiveTab } from '@/hooks/useActiveTab'
import { useMarkNotificationsAsRead } from '@/hooks/useMarkNotificationsAsRead'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Alert, Button, Grid, Link, Stack, Tab, Typography } from '@mui/material'
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
import { apiV2GuideLink } from '@/config/constants'
import { useNavigate } from '@/router'

const ConsumerClientManagePage: React.FC = () => {
  const { t } = useTranslation('client', { keyPrefix: 'edit' })
  const { t: actionT } = useTranslation('common', { keyPrefix: 'actions' })
  const { clientId } = useParams<'SUBSCRIBE_CLIENT_EDIT' | 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT'>()
  const clientKind = useClientKind()
  const { activeTab, updateActiveTab } = useActiveTab('clientOperators')
  const navigate = useNavigate()

  const { data: client, isLoading: isLoadingClient } = useQuery(ClientQueries.getSingle(clientId))

  const { actions } = useGetClientActions(client)

  useMarkNotificationsAsRead(clientId)

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()
  const { mutate: removeClientAdmin } = ClientMutations.useRemoveClientAdmin()

  const handleRemoveClientAdmin = () => {
    if (!client?.admin) return
    removeClientAdmin({
      clientId: client.id,
      adminId: client.admin.userId,
      userName: `${client.admin.name} ${client.admin.familyName}`,
    })
  }

  return (
    <PageContainer
      title={client?.name ?? ''}
      description={client?.description}
      topSideActions={[
        {
          action: () =>
            navigate(
              clientKind === 'API' ? 'SIMULATE_GET_VOUCHER_API' : 'SIMULATE_GET_VOUCHER_CONSUMER'
            ),
          label: actionT('simulateVoucher'),
          variant: 'contained',
        },
        ...actions,
      ]}
      isLoading={isLoadingClient}
      backToAction={{
        label: t('actions.backToClientsLabel'),
        to: clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M' : 'SUBSCRIBE_CLIENT_LIST',
      }}
    >
      <Alert severity="info">
        <Stack direction="row" spacing={3}>
          <Typography>{t('alertApiV2.description')}</Typography>
          <Link variant="button" underline="none" href={apiV2GuideLink} target="_blank">
            {t('alertApiV2.linkLabel')}
          </Link>
        </Stack>
      </Alert>
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
                </Stack>
              ) : (
                <Button variant="outlined" onClick={openDrawer}>
                  {t('adminSection.actions.selectAdminLabel')}
                </Button>
              )}
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
      {clientKind === 'API' && (
        <SetClientAdminDrawer
          isOpen={isOpen}
          onClose={closeDrawer}
          clientId={clientId}
          admin={client?.admin}
        />
      )}
    </PageContainer>
  )
}

export default ConsumerClientManagePage

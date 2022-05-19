import React from 'react'
import { useLocation } from 'react-router-dom'
import { Tab } from '@mui/material'
import { TabList, TabContext, TabPanel } from '@mui/lab'
import { Client } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { buildDynamicPath, buildDynamicRoute, getBits } from '../lib/router-utils'
import { UserList } from './UserList'
import { useFeedback } from '../hooks/useFeedback'
import { KeysList } from '../components/KeysList'
import { useActiveTab } from '../hooks/useActiveTab'
import { useClientKind } from '../hooks/useClientKind'
import { useRoute } from '../hooks/useRoute'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { StyledButton } from '../components/Shared/StyledButton'
import { VoucherRead } from '../components/VoucherRead'
import { PageReloadMessage } from '../components/Shared/PageReloadMessage'
import { useTranslation } from 'react-i18next'

export function ClientEdit() {
  const { t } = useTranslation('client')
  const { routes } = useRoute()
  const location = useLocation()
  const { forceRerenderCounter, runAction } = useFeedback()
  const { activeTab, updateActiveTab } = useActiveTab('voucher')
  const locationBits = getBits(location)
  const clientId = locationBits[locationBits.length - 1]
  const clientKind = useClientKind()
  const { data, isLoading, error } = useAsyncFetch<Client>(
    { path: { endpoint: 'CLIENT_GET_SINGLE', endpointParams: { clientId } } },
    { useEffectDeps: [forceRerenderCounter] }
  )
  /*
   * List of possible actions for the user to perform
   */
  const deleteClient = async () => {
    await runAction(
      { path: { endpoint: 'CLIENT_DELETE', endpointParams: { clientId } } },
      {
        showConfirmDialog: true,
        onSuccessDestination:
          clientKind === 'API'
            ? buildDynamicRoute(routes.SUBSCRIBE_INTEROP_M2M, {}, { tab: 'clients' })
            : routes.SUBSCRIBE_CLIENT_LIST,
      }
    )
  }
  /*
   * End list of actions
   */

  return (
    <React.Fragment>
      <StyledIntro isLoading={isLoading}>
        {{ title: data?.name, description: data?.description }}
      </StyledIntro>
      <TabContext value={activeTab}>
        <TabList
          onChange={updateActiveTab}
          aria-label={t('edit.tabs.ariaLabel')}
          variant="fullWidth"
        >
          <Tab label={t('edit.tabs.voucher')} value="voucher" />
          <Tab label={t('edit.tabs.securityOperators')} value="securityOperators" />
          <Tab label={t('edit.tabs.publicKeys')} value="publicKeys" />
        </TabList>

        <TabPanel value="voucher">
          {error ? (
            <PageReloadMessage />
          ) : isLoading ? (
            <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
          ) : (
            <React.Fragment>
              <VoucherRead
                clientKind={clientKind}
                clientId={clientId}
                purposes={data && data.purposes}
              />

              <PageBottomActions>
                <StyledButton variant="contained" onClick={deleteClient}>
                  {t('edit.actions.deleteLabel')}
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  to={
                    clientKind === 'API'
                      ? buildDynamicPath(routes.SUBSCRIBE_INTEROP_M2M.PATH, {}, { tab: 'clients' })
                      : routes.SUBSCRIBE_CLIENT_LIST.PATH
                  }
                >
                  {t('edit.actions.backToClientsLabel')}
                </StyledButton>
              </PageBottomActions>
            </React.Fragment>
          )}
        </TabPanel>

        <TabPanel value="securityOperators">
          <UserList clientKind={clientKind} />
        </TabPanel>

        <TabPanel value="publicKeys">
          <KeysList clientKind={clientKind} />
        </TabPanel>
      </TabContext>
    </React.Fragment>
  )
}

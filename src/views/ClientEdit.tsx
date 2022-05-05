import React from 'react'
import { useLocation } from 'react-router-dom'
import { Tab, Typography } from '@mui/material'
import { TabList, TabContext, TabPanel } from '@mui/lab'
import { Client } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { buildDynamicPath, buildDynamicRoute, getBits } from '../lib/router-utils'
import { UserList } from './UserList'
import { useFeedback } from '../hooks/useFeedback'
import { KeysList } from '../components/KeysList'
// import { EditableField } from '../components/Shared/EditableField'
import { useActiveTab } from '../hooks/useActiveTab'
import { useClientKind } from '../hooks/useClientKind'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { useRoute } from '../hooks/useRoute'
import { StyledLink } from '../components/Shared/StyledLink'
import { InlineClipboard } from '../components/Shared/InlineClipboard'
import { URL_INTEROP_M2M } from '../lib/constants'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { StyledButton } from '../components/Shared/StyledButton'
import { TableVoucher } from '../components/Shared/TableVoucher'

export function ClientEdit() {
  const { routes } = useRoute()
  const location = useLocation()
  const { forceRerenderCounter, runAction } = useFeedback()
  const { activeTab, updateActiveTab } = useActiveTab('voucher')
  const locationBits = getBits(location)
  const clientId = locationBits[locationBits.length - 1]
  const clientKind = useClientKind()
  const { data, isLoading } = useAsyncFetch<Client>(
    { path: { endpoint: 'CLIENT_GET_SINGLE', endpointParams: { clientId } } },
    { useEffectDeps: [forceRerenderCounter] }
  )

  // const wrapFieldUpdate = (fieldName: 'description') => (updatedString: string | null) => {
  //   // TEMP PIN-1113
  //   console.log({ fieldName, updatedString })
  // }

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
          aria-label="Due tab diverse per i dettagli del client e gli operatori di sicurezza"
          variant="fullWidth"
        >
          <Tab label="Dettagli voucher" value="voucher" />
          <Tab label="Operatori di sicurezza" value="securityOperators" />
          <Tab label="Chiavi pubbliche" value="publicKeys" />
        </TabList>

        <TabPanel value="voucher">
          {data ? (
            <React.Fragment>
              {/* <DescriptionBlock label="Descrizione" childWrapperSx={{ pt: 0 }}>
            <EditableField
              value={data.description}
              onSave={wrapFieldUpdate('description')}
              ariaLabel="Modifica descrizione"
              multiline={true}
            />
          </DescriptionBlock> */}
              {clientKind === 'CONSUMER' ? (
                <TableVoucher purposes={data.purposes} clientId={clientId} isLoading={isLoading} />
              ) : (
                <React.Fragment>
                  <DescriptionBlock sx={{ mb: 4 }} label="Id del client (subject – clientId)">
                    <InlineClipboard
                      textToCopy={data.id}
                      successFeedbackText="Id copiato correttamente"
                    />
                  </DescriptionBlock>

                  <DescriptionBlock sx={{ mb: 4 }} label="Id della finalità (purposeId)">
                    <Typography component="span">
                      Il purposeId non si applica in questo caso
                    </Typography>
                  </DescriptionBlock>

                  <DescriptionBlock sx={{ mb: 4 }} label="Audience">
                    <InlineClipboard
                      textToCopy="test.interop.pagopa.it"
                      successFeedbackText="Id copiato correttamente"
                    />
                  </DescriptionBlock>

                  {URL_INTEROP_M2M && (
                    <DescriptionBlock sx={{ mb: 4 }} label="Gateway da contattare (url)">
                      <InlineClipboard
                        textToCopy={URL_INTEROP_M2M}
                        successFeedbackText="Id copiato correttamente"
                      />
                    </DescriptionBlock>
                  )}

                  <DescriptionBlock sx={{ mb: 4 }} label="Interfaccia API">
                    <StyledLink to={routes.SUBSCRIBE_INTEROP_M2M.PATH}>
                      Vai all&lsquo;interfaccia
                    </StyledLink>
                  </DescriptionBlock>

                  <DescriptionBlock sx={{ mb: 4 }} label="Chiavi pubbliche">
                    <Typography component="span">
                      Per firmare questo token, puoi usare qualsiasi chiave pubblica sia presente in
                      questo client nella tab &quot;Chiavi pubbliche&quot;
                    </Typography>
                  </DescriptionBlock>
                </React.Fragment>
              )}

              <PageBottomActions>
                <StyledButton variant="contained" onClick={deleteClient}>
                  Elimina
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  to={
                    clientKind === 'API'
                      ? buildDynamicPath(routes.SUBSCRIBE_INTEROP_M2M.PATH, {}, { tab: 'clients' })
                      : routes.SUBSCRIBE_CLIENT_LIST.PATH
                  }
                >
                  Torna alla lista dei client
                </StyledButton>
              </PageBottomActions>
            </React.Fragment>
          ) : (
            <LoadingWithMessage
              label="Stiamo caricando il client richiesto"
              transparentBackground
            />
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

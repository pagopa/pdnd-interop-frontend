import React from 'react'
import { useLocation } from 'react-router-dom'
import { Tab, Typography } from '@mui/material'
import { TabList, TabContext, TabPanel } from '@mui/lab'
import { Client } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { buildDynamicPath, getBits } from '../lib/router-utils'
import { UserList } from './UserList'
import { useFeedback } from '../hooks/useFeedback'
import { StyledSkeleton } from '../components/Shared/StyledSkeleton'
import { KeysList } from '../components/KeysList'
// import { EditableField } from '../components/Shared/EditableField'
import { useActiveTab } from '../hooks/useActiveTab'
import { useClientKind } from '../hooks/useClientKind'
import { StyledAccordion } from '../components/Shared/StyledAccordion'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { useRoute } from '../hooks/useRoute'
import { StyledLink } from '../components/Shared/StyledLink'
import { InlineClipboard } from '../components/Shared/InlineClipboard'
import { getComputedClientAssertionState } from '../lib/client'
import { URL_INTEROP_M2M } from '../lib/constants'

export function ClientEdit() {
  const { routes } = useRoute()
  const location = useLocation()
  const { forceRerenderCounter } = useFeedback()
  const { activeTab, updateActiveTab } = useActiveTab('clientAssertion')
  const locationBits = getBits(location)
  const clientId = locationBits[locationBits.length - 1]
  const clientKind = useClientKind()
  const { data } = useAsyncFetch<Client>(
    {
      path: { endpoint: 'CLIENT_GET_SINGLE', endpointParams: { clientId } },
    },
    {
      useEffectDeps: [forceRerenderCounter],
      loadingTextLabel: 'Stiamo caricando il client richiesto',
    }
  )

  // const wrapFieldUpdate = (fieldName: 'description') => (updatedString: string | null) => {
  //   // TEMP PIN-1113
  //   console.log({ fieldName, updatedString })
  // }

  if (!data) {
    return <StyledSkeleton />
  }

  return (
    <React.Fragment>
      <StyledIntro sx={{ mb: 0 }}>
        {{ title: data.name, description: data.description }}
      </StyledIntro>
      <TabContext value={activeTab}>
        <TabList
          onChange={updateActiveTab}
          aria-label="Due tab diverse per i dettagli del client e gli operatori di sicurezza"
          sx={{ my: 6 }}
          variant="fullWidth"
        >
          <Tab label="Client assertion" value="clientAssertion" />
          <Tab label="Operatori di sicurezza" value="securityOperators" />
          <Tab label="Chiavi pubbliche" value="publicKeys" />
        </TabList>

        <TabPanel value="clientAssertion">
          {/* <DescriptionBlock label="Descrizione" childWrapperSx={{ pt: 0 }}>
            <EditableField
              value={data.description}
              onSave={wrapFieldUpdate('description')}
              ariaLabel="Modifica descrizione"
              multiline={true}
            />
          </DescriptionBlock> */}

          {clientKind === 'CONSUMER' ? (
            Boolean(data.purposes.length > 0) ? (
              <DescriptionBlock sx={{ my: 0 }} label="Client assertion disponibili">
                <StyledAccordion
                  entries={data.purposes.map((p) => {
                    return {
                      summary: (
                        <React.Fragment>
                          <Typography component="span" sx={{ fontWeight: 700 }}>
                            {p.title}
                          </Typography>{' '}
                          per {p.agreement.eservice.name}
                        </React.Fragment>
                      ),
                      details: (
                        <React.Fragment>
                          <DescriptionBlock sx={{ mb: 4 }} label="Id del client">
                            <Typography>sub – subject – clientId</Typography>
                            <InlineClipboard
                              text={data.id}
                              successFeedbackText="Id copiato correttamente"
                            />
                          </DescriptionBlock>

                          <DescriptionBlock sx={{ mb: 4 }} label="Id della finalità">
                            <Typography>purposeId</Typography>
                            <InlineClipboard
                              text={p.purposeId}
                              successFeedbackText="Id copiato correttamente"
                            />
                          </DescriptionBlock>

                          <DescriptionBlock sx={{ mb: 4 }} label="Audience">
                            <InlineClipboard
                              text="test.interop.pagopa.it"
                              successFeedbackText="Id copiato correttamente"
                            />
                          </DescriptionBlock>

                          <DescriptionBlock sx={{ mb: 4 }} label="Il token può essere staccato?">
                            <Typography component="span">
                              {getComputedClientAssertionState(p)}
                            </Typography>
                          </DescriptionBlock>

                          <DescriptionBlock sx={{ mb: 4 }} label="E-service">
                            <StyledLink
                              to={buildDynamicPath(routes.SUBSCRIBE_CATALOG_VIEW.PATH, {
                                eserviceId: p.agreement.eservice.id,
                                descriptorId: p.agreement.descriptor.id,
                              })}
                            >
                              {p.agreement.eservice.name}
                            </StyledLink>
                          </DescriptionBlock>

                          <DescriptionBlock sx={{ mb: 4 }} label="Chiavi pubbliche">
                            <Typography component="span">
                              Per firmare questo token, puoi usare qualsiasi chiave pubblica sia
                              presente in questo client nella tab &quot;Chiavi pubbliche&quot;
                            </Typography>
                          </DescriptionBlock>
                        </React.Fragment>
                      ),
                    }
                  })}
                />

                <Typography sx={{ mt: 2 }}>
                  Per maggiori informazioni su come costruire la client assertion,{' '}
                  <StyledLink to={routes.CLIENT_ASSERTION_GUIDE.PATH} target="_blank">
                    leggi la guida
                  </StyledLink>
                  .
                </Typography>
              </DescriptionBlock>
            ) : (
              <Typography>
                Questo client non è associato a nessuna finalità, dunque non ci sono client
                assertion disponibili.
              </Typography>
            )
          ) : (
            <React.Fragment>
              <DescriptionBlock sx={{ mb: 4 }} label="Id del client (subject – clientId)">
                <InlineClipboard text={data.id} successFeedbackText="Id copiato correttamente" />
              </DescriptionBlock>

              <DescriptionBlock sx={{ mb: 4 }} label="Id della finalità (purposeId)">
                <Typography component="span">
                  null (il purposeId non si applica in questo caso)
                </Typography>
              </DescriptionBlock>

              <DescriptionBlock sx={{ mb: 4 }} label="Audience">
                <InlineClipboard
                  text="test.interop.pagopa.it"
                  successFeedbackText="Id copiato correttamente"
                />
              </DescriptionBlock>

              {URL_INTEROP_M2M && (
                <DescriptionBlock sx={{ mb: 4 }} label="Gateway da contattare (url)">
                  <InlineClipboard
                    text={URL_INTEROP_M2M}
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

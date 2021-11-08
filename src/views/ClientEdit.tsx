import React, { FunctionComponent, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Client, ClientStatus, ActionProps } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import {
  AGREEMENT_STATUS_LABEL,
  CLIENT_STATUS_LABEL,
  ESERVICE_STATUS_LABEL,
  NARROW_MAX_WIDTH,
  ROUTES,
} from '../lib/constants'
import { buildDynamicPath, getLastBit } from '../lib/url-utils'
import isEmpty from 'lodash/isEmpty'
import { UserList } from './UserList'
import { getClientComputedStatus } from '../lib/status-utils'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext } from '../lib/context'
import { useFeedback } from '../hooks/useFeedback'
import { StyledLink } from '../components/Shared/StyledLink'
import { StyledButton } from '../components/Shared/StyledButton'
import { Box } from '@mui/system'
import { Tab, Tabs, Typography } from '@mui/material'

type TabPanelType = {
  value: number
  index: number
}

const TabPanel: FunctionComponent<TabPanelType> = ({ value, index, children }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index ? children : null}
    </div>
  )
}

const a11yProps = (index: number) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
})

export function ClientEdit() {
  const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()
  const [activeTab, setActiveTab] = useState(0)
  const { party } = useContext(PartyContext)
  const clientId = getLastBit(useLocation())
  const { data } = useAsyncFetch<Client>(
    {
      path: { endpoint: 'CLIENT_GET_SINGLE', endpointParams: { clientId } },
    },
    {
      defaultValue: {},
      useEffectDeps: [forceRerenderCounter],
      loadingTextLabel: 'Stiamo caricando il client richiesto',
    }
  )

  const updateActiveTab = (_: any, newTab: number) => {
    setActiveTab(newTab)
  }

  /*
   * List of possible actions for the user to perform
   */
  const suspend = async () => {
    await runAction(
      {
        path: { endpoint: 'CLIENT_SUSPEND', endpointParams: { clientId: data.id } },
      },
      { suppressToast: false }
    )
  }

  const reactivate = async () => {
    await runAction(
      {
        path: { endpoint: 'CLIENT_ACTIVATE', endpointParams: { clientId: data.id } },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = () => {
    if (isEmpty(data) || !isAdmin(party)) {
      return []
    }

    const actions: { [key in ClientStatus]: ActionProps[] } = {
      active: [{ onClick: wrapActionInDialog(suspend, 'CLIENT_SUSPEND'), label: 'Sospendi' }],
      suspended: [
        {
          onClick: wrapActionInDialog(reactivate, 'CLIENT_ACTIVATE'),
          label: 'Riattiva',
        },
      ],
    }

    return actions[data.status]
  }

  const getReasonClientIsBlocked = () => {
    const reasons: string[] = []

    if (
      data.agreement.descriptor.status !== 'published' &&
      data.agreement.descriptor.status !== 'deprecated'
    ) {
      reasons.push("l'erogatore dell'e-service ha sospeso questa versione")
    }

    if (data.agreement.status !== 'active') {
      reasons.push("l'accordo di interoperabilità relativo all'e-service non è attivo")
    }

    if (data.status !== 'active') {
      reasons.push('il client non è attivo')
    }

    return reasons
  }

  const actions = getAvailableActions()

  if (isEmpty(data)) {
    return null
  }

  return (
    <React.Fragment>
      <StyledIntro>{{ title: `Client: ${data.name}` }}</StyledIntro>

      <Tabs
        value={activeTab}
        onChange={updateActiveTab}
        aria-label="Due tab diverse per i dettagli del client e gli operatori di sicurezza"
        sx={{ mb: 2 }}
      >
        <Tab label="Dettagli del client" {...a11yProps(0)} />
        <Tab label="Operatori di sicurezza" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <Box style={{ maxWidth: NARROW_MAX_WIDTH }}>
          <DescriptionBlock label="Descrizione">
            <Typography component="span">{data.description}</Typography>
          </DescriptionBlock>

          <DescriptionBlock label="Questo client può accedere all'e-service?">
            <Typography component="span">
              {getClientComputedStatus(data) === 'active'
                ? 'Sì'
                : `No: ${getReasonClientIsBlocked().join(', ')}`}
            </Typography>
          </DescriptionBlock>

          <DescriptionBlock label="Stato del client">
            <Typography component="span">{CLIENT_STATUS_LABEL[data.status]}</Typography>
          </DescriptionBlock>

          <DescriptionBlock label="La versione dell'e-service che stai usando">
            <Typography component="span">
              <StyledLink
                to={buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_VIEW.PATH, {
                  eserviceId: data.eservice.id,
                  descriptorId: data.agreement.descriptor.id,
                })}
              >
                {data.eservice.name}, versione {data.agreement.descriptor.version}
              </StyledLink>{' '}
              {!!(
                data.eservice.activeDescriptor &&
                data.agreement.descriptor.version !== data.eservice.activeDescriptor.version
              ) && (
                <Typography sx={{ mt: 1 }}>
                  È disponibile una versione più recente
                  <br />
                  <StyledLink
                    to={buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_VIEW.PATH, {
                      eserviceId: data.eservice.id,
                      descriptorId: data.eservice.activeDescriptor.id,
                    })}
                  >
                    Vedi il contenuto della nuova versione
                  </StyledLink>
                  <br />
                  <StyledLink
                    to={buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_EDIT.PATH, {
                      id: data.agreement.id,
                    })}
                  >
                    Vai alla pagina dell'accordo
                  </StyledLink>{' '}
                  (da lì potrai aggiornarlo)
                </Typography>
              )}
            </Typography>
          </DescriptionBlock>

          <DescriptionBlock label="Ente erogatore">
            <Typography component="span">{data.eservice.provider.description}</Typography>
          </DescriptionBlock>

          <DescriptionBlock
            label={`Stato dell'e-service per la versione ${data.agreement.descriptor.version}`}
          >
            <Typography component="span">
              {ESERVICE_STATUS_LABEL[data.agreement.descriptor.status]}
            </Typography>
          </DescriptionBlock>

          <DescriptionBlock label="Accordo">
            <Typography component="span">
              <StyledLink
                to={buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_EDIT.PATH, {
                  id: data.agreement.id,
                })}
              >
                Vedi accordo
              </StyledLink>
            </Typography>
          </DescriptionBlock>

          <DescriptionBlock label="Stato dell'accordo">
            <Typography component="span">
              {AGREEMENT_STATUS_LABEL[data.agreement.status]}
            </Typography>
          </DescriptionBlock>

          <DescriptionBlock label="Finalità">
            <Typography component="span">{data.purposes}</Typography>
          </DescriptionBlock>
        </Box>

        {actions.length > 0 && (
          <Box sx={{ mt: 4, display: 'flex' }}>
            {actions.map(({ onClick, label }, i) => (
              <StyledButton variant="contained" key={i} onClick={onClick}>
                {label}
              </StyledButton>
            ))}
          </Box>
        )}
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <UserList />
      </TabPanel>
    </React.Fragment>
  )
}

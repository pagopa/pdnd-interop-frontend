import React, { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Tab, Tabs, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { CLIENT_STATE_LABEL } from '../config/labels'
import { ROUTES } from '../config/routes'
import { Client, ClientState, ActionProps } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { buildDynamicPath, getBits } from '../lib/router-utils'
import { UserList } from './UserList'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext } from '../lib/context'
import { useFeedback } from '../hooks/useFeedback'
import { StyledLink } from '../components/Shared/StyledLink'
import { StyledButton } from '../components/Shared/StyledButton'
import { a11yProps, TabPanel } from '../components/TabPanel'
import { StyledSkeleton } from '../components/Shared/StyledSkeleton'
import { KeysList } from '../components/KeysList'

export function ClientEdit() {
  const location = useLocation()
  const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()
  const [activeTab, setActiveTab] = useState(0)
  const { party } = useContext(PartyContext)
  const locationBits = getBits(location)
  const clientId = locationBits[locationBits.length - 1]
  const { data } = useAsyncFetch<Client>(
    {
      path: { endpoint: 'CLIENT_GET_SINGLE', endpointParams: { clientId } },
    },
    {
      useEffectDeps: [forceRerenderCounter],
      loadingTextLabel: 'Stiamo caricando il client richiesto',
    }
  )

  const updateActiveTab = (_: React.SyntheticEvent, newTab: number) => {
    setActiveTab(newTab)
  }

  /*
   * List of possible actions for the user to perform
   */
  const suspend = async () => {
    const sureData = data as Client
    await runAction(
      {
        path: { endpoint: 'CLIENT_SUSPEND', endpointParams: { clientId: sureData.id } },
      },
      { suppressToast: false }
    )
  }

  const reactivate = async () => {
    const sureData = data as Client
    await runAction(
      {
        path: { endpoint: 'CLIENT_ACTIVATE', endpointParams: { clientId: sureData.id } },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = () => {
    if (!data || !isAdmin(party)) {
      return []
    }
    const sureData = data as Client

    const actions: Record<ClientState, Array<ActionProps>> = {
      ACTIVE: [{ onClick: wrapActionInDialog(suspend, 'CLIENT_SUSPEND'), label: 'Sospendi' }],
      SUSPENDED: [
        {
          onClick: wrapActionInDialog(reactivate, 'CLIENT_ACTIVATE'),
          label: 'Riattiva',
        },
      ],
    }

    return actions[sureData.state]
  }

  if (!data) {
    return <StyledSkeleton />
  }

  const actions = getAvailableActions()

  return (
    <React.Fragment>
      <StyledIntro sx={{ mb: 0 }}>{{ title: data.name }}</StyledIntro>

      <Tabs
        value={activeTab}
        onChange={updateActiveTab}
        aria-label="Due tab diverse per i dettagli del client e gli operatori di sicurezza"
        sx={{ mb: 6 }}
      >
        <Tab label="Dettagli del client" {...a11yProps(0)} />
        <Tab label="Operatori di sicurezza" {...a11yProps(1)} />
        <Tab label="Chiavi pubbliche" {...a11yProps(2)} />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <DescriptionBlock label="Descrizione">
          <Typography component="span">{data.description}</Typography>
        </DescriptionBlock>

        <DescriptionBlock label="La versione dell'e-service che stai usando">
          <Typography component="span">
            <StyledLink
              to={buildDynamicPath(ROUTES.SUBSCRIBE_CATALOG_VIEW.PATH, {
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
                  to={buildDynamicPath(ROUTES.SUBSCRIBE_CATALOG_VIEW.PATH, {
                    eserviceId: data.eservice.id,
                    descriptorId: data.eservice.activeDescriptor.id,
                  })}
                >
                  Vedi il contenuto della nuova versione
                </StyledLink>
                <br />
                <StyledLink
                  to={buildDynamicPath(ROUTES.SUBSCRIBE_AGREEMENT_EDIT.PATH, {
                    id: data.agreement.id,
                  })}
                >
                  Vai alla pagina dell’accordo
                </StyledLink>{' '}
                (da lì potrai aggiornarlo)
              </Typography>
            )}
          </Typography>
        </DescriptionBlock>

        <DescriptionBlock label="Ente erogatore">
          <Typography component="span">{data.eservice.provider.description}</Typography>
        </DescriptionBlock>

        <DescriptionBlock label="Accordo">
          <Typography component="span">
            <StyledLink
              to={buildDynamicPath(ROUTES.SUBSCRIBE_AGREEMENT_EDIT.PATH, {
                id: data.agreement.id,
              })}
            >
              Vedi accordo
            </StyledLink>
          </Typography>
        </DescriptionBlock>

        <DescriptionBlock label="Finalità">
          <Typography component="span">{data.purposes}</Typography>
        </DescriptionBlock>

        <DescriptionBlock label="Stato del client">
          <Typography component="span">{CLIENT_STATE_LABEL[data.state]}</Typography>
        </DescriptionBlock>

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

      <TabPanel value={activeTab} index={2}>
        <KeysList />
      </TabPanel>
    </React.Fragment>
  )
}

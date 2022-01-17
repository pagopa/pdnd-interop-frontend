import React, { useContext, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useLocation } from 'react-router-dom'
import { ActionProps, ApiEndpointKey, ProviderOrSubscriber, User, UserState } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { getBits } from '../lib/router-utils'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext } from '../lib/context'
import { useMode } from '../hooks/useMode'
import { mergeActions } from '../lib/eservice-utils'
import { SecurityOperatorKeys } from '../components/SecurityOperatorKeys'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { Tab, Tabs, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { a11yProps, TabPanel } from '../components/TabPanel'
import { USER_PLATFORM_ROLE_LABEL, USER_ROLE_LABEL, USER_STATE_LABEL } from '../config/labels'

type UserEndpoinParams = { operatorTaxCode: string; clientId: string } | { relationshipId: string }

export function UserEdit() {
  const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()
  const mode = useMode()
  const currentMode = mode as ProviderOrSubscriber
  const { party } = useContext(PartyContext)
  const bits = getBits(useLocation())
  const relationshipId = bits[bits.length - 1]

  const [activeTab, setActiveTab] = useState(0)
  const updateActiveTab = (_: React.SyntheticEvent, newTab: number) => {
    setActiveTab(newTab)
  }

  let clientId: string | undefined = bits[bits.length - 3]
  let endpoint: ApiEndpointKey = 'OPERATOR_SECURITY_GET_SINGLE'
  let endpointParams: UserEndpoinParams = { operatorTaxCode: relationshipId, clientId }
  if (mode === 'provider') {
    clientId = undefined
    endpoint = 'OPERATOR_API_GET_SINGLE'
    endpointParams = { relationshipId }
  }

  const { data: userData } = useAsyncFetch<User>(
    { path: { endpoint, endpointParams } },
    {
      useEffectDeps: [forceRerenderCounter],
      loadingTextLabel: "Stiamo caricando l'operatore richiesto",
    }
  )

  console.log(userData)

  /*
   * List of possible actions for the user to perform
   */
  const suspend = async () => {
    await runAction(
      { path: { endpoint: 'USER_SUSPEND', endpointParams: { relationshipId: userData?.id } } },
      { suppressToast: false }
    )
  }

  const reactivate = async () => {
    await runAction(
      { path: { endpoint: 'USER_REACTIVATE', endpointParams: { relationshipId: userData?.id } } },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */
  type UserActions = Record<UserState, Array<ActionProps>>

  // Build list of available actions for each service in its current state
  const getAvailableActions = () => {
    if (isEmpty(userData) || !isAdmin(party)) {
      return []
    }

    const sharedActions: UserActions = {
      ACTIVE: [{ onClick: wrapActionInDialog(suspend, 'USER_SUSPEND'), label: 'Sospendi' }],
      SUSPENDED: [
        {
          onClick: wrapActionInDialog(reactivate, 'USER_REACTIVATE'),
          label: 'Riattiva',
        },
      ],
      PENDING: [],
    }

    const providerOnlyActions: UserActions = { ACTIVE: [], SUSPENDED: [], PENDING: [] }

    const subscriberOnlyActions: UserActions = { ACTIVE: [], SUSPENDED: [], PENDING: [] }

    const currentActions = { provider: providerOnlyActions, subscriber: subscriberOnlyActions }[
      currentMode
    ]

    return mergeActions([sharedActions, currentActions], 'ACTIVE')
  }

  const UserSheet = () => {
    return (
      <TabPanel value={activeTab} index={0}>
        <DescriptionBlock label="Nome e cognome">
          <Typography component="span">
            {userData?.name && userData?.surname ? userData.name + ' ' + userData.surname : 'n/d'}
          </Typography>
        </DescriptionBlock>

        <DescriptionBlock label="Email">
          <Typography component="span">{userData?.email || 'n/d'}</Typography>
        </DescriptionBlock>

        <DescriptionBlock label="Ruolo">
          <Typography component="span">
            {userData?.role ? USER_ROLE_LABEL[userData.role] : 'n/d'}
          </Typography>
        </DescriptionBlock>

        <DescriptionBlock label="Permessi">
          <Typography component="span">
            {userData?.product.role ? USER_PLATFORM_ROLE_LABEL[userData.product.role] : 'n/d'}
          </Typography>
        </DescriptionBlock>

        <DescriptionBlock label="Stato dell'utenza sulla piattaforma">
          <Typography component="span">
            {userData?.state ? USER_STATE_LABEL[userData.state] : 'n/d'}
          </Typography>
        </DescriptionBlock>

        <Box sx={{ mt: 8, display: 'flex' }}>
          {getAvailableActions().map(({ onClick, label }, i) => (
            <StyledButton variant="contained" key={i} onClick={onClick}>
              {label}
            </StyledButton>
          ))}
        </Box>
      </TabPanel>
    )
  }

  return (
    <React.Fragment>
      <StyledIntro sx={{ mb: 0 }}>{{ title: 'Modifica operatore' }}</StyledIntro>

      {mode === 'provider' ? (
        <UserSheet />
      ) : (
        <React.Fragment>
          <Tabs
            value={activeTab}
            onChange={updateActiveTab}
            aria-label="Due tab diverse per le informazioni dell'operatore e la chiave pubblica che può caricare"
            sx={{ mb: 6 }}
          >
            <Tab label="Informazioni sull'operatore" {...a11yProps(0)} />
            <Tab label="Chiave pubblica" {...a11yProps(1)} />
          </Tabs>

          <UserSheet />

          {clientId && !isEmpty(userData) && (
            <TabPanel value={activeTab} index={1}>
              <SecurityOperatorKeys clientId={clientId} userData={userData as unknown as User} />
            </TabPanel>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ApiEndpointKey, PublicKey, User } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { buildDynamicPath, buildDynamicRoute, getBits } from '../lib/router-utils'
import { useMode } from '../hooks/useMode'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { USER_PLATFORM_ROLE_LABEL, USER_ROLE_LABEL, USER_STATE_LABEL } from '../config/labels'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { AxiosResponse } from 'axios'
import { StyledLink } from '../components/Shared/StyledLink'
import { useRoute } from '../hooks/useRoute'
import { PartyContext } from '../lib/context'
import { isAdmin } from '../lib/auth-utils'

type UserEndpoinParams = {
  relationshipId: string
  clientId?: string
}

export function UserEdit() {
  const { party } = useContext(PartyContext)
  const { routes } = useRoute()
  const { runActionWithDestination, wrapActionInDialog, forceRerenderCounter } = useFeedback()
  const mode = useMode()
  const bits = getBits(useLocation())
  const relationshipId = bits[bits.length - 1]
  const [keys, setKeys] = useState<Array<PublicKey>>([])

  let clientId: string | undefined = bits[bits.length - 3]
  let endpoint: ApiEndpointKey = 'OPERATOR_SECURITY_GET_SINGLE'
  const endpointParams: UserEndpoinParams = {
    clientId,
    relationshipId,
  }
  if (mode === 'provider') {
    clientId = undefined
    endpoint = 'OPERATOR_API_GET_SINGLE'
  }

  const { data: userData } = useAsyncFetch<User>(
    { path: { endpoint, endpointParams } },
    {
      useEffectDeps: [forceRerenderCounter],
      loadingTextLabel: "Stiamo caricando l'operatore richiesto",
    }
  )

  useEffect(() => {
    async function asyncFetchKeyData(operatorId: string) {
      const response = await fetchWithLogs({
        path: {
          endpoint: 'OPERATOR_SECURITY_GET_KEYS_LIST',
          endpointParams: { clientId, operatorId },
        },
      })

      if (!isFetchError(response)) {
        setKeys((response as AxiosResponse).data.keys)
      }
    }

    // Fetch associated keys for security operators
    if (userData && userData.product.role === 'security') {
      asyncFetchKeyData(userData.id)
    }
  }, [userData]) // eslint-disable-line react-hooks/exhaustive-deps

  /*
   * List of possible actions for the user to perform
   */
  // const suspend = async () => {
  //   await runAction(
  //     { path: { endpoint: 'USER_SUSPEND', endpointParams: { relationshipId: userData?.id } } },
  //     { suppressToast: false }
  //   )
  // }

  // const reactivate = async () => {
  //   await runAction(
  //     { path: { endpoint: 'USER_REACTIVATE', endpointParams: { relationshipId: userData?.id } } },
  //     { suppressToast: false }
  //   )
  // }

  const removeFromClient = async () => {
    await runActionWithDestination(
      {
        path: {
          endpoint: 'OPERATOR_SECURITY_REMOVE_FROM_CLIENT',
          endpointParams: { clientId, relationshipId: userData?.relationshipId },
        },
      },
      {
        destination: buildDynamicRoute(
          routes.SUBSCRIBE_CLIENT_EDIT,
          { clientId: clientId as string },
          { tab: 'securityOperators' }
        ),
        suppressToast: false,
      }
    )
  }
  /*
   * End list of actions
   */
  // type UserActions = Record<UserState, Array<ActionProps>>

  // TEMP: User suspension and reactivation may be removed from interop and only available in self-care
  // Build list of available actions for each service in its current state
  // const getAvailableActions = () => {
  //   // Only admins can handle other people
  //   // also, if same user, it cannot suspend or reactivate itself
  //   if (!isAdmin(party) || !userData || isCurrentUser(userData.from)) {
  //     return []
  //   }

  //   const sharedActions: UserActions = {
  //     ACTIVE: [{ onClick: wrapActionInDialog(suspend, 'USER_SUSPEND'), label: 'Sospendi' }],
  //     SUSPENDED: [
  //       {
  //         onClick: wrapActionInDialog(reactivate, 'USER_REACTIVATE'),
  //         label: 'Riattiva',
  //       },
  //     ],
  //     PENDING: [],
  //   }

  //   const providerOnlyActions: UserActions = { ACTIVE: [], SUSPENDED: [], PENDING: [] }

  //   const subscriberOnlyActions: UserActions = { ACTIVE: [], SUSPENDED: [], PENDING: [] }

  //   const currentActions = { provider: providerOnlyActions, subscriber: subscriberOnlyActions }[
  //     currentMode
  //   ]

  //   return mergeActions([sharedActions, currentActions], 'ACTIVE')
  // }
  const getAvailableActions = () => {
    if (mode === 'subscriber' && isAdmin(party)) {
      const removeFromClientAction = {
        onClick: wrapActionInDialog(removeFromClient, 'OPERATOR_SECURITY_REMOVE_FROM_CLIENT'),
        label: 'Rimuovi dal client',
      }

      return [removeFromClientAction]
    }

    return []
  }

  return (
    <React.Fragment>
      <StyledIntro sx={{ mb: 0 }}>{{ title: 'Gestisci utenza' }}</StyledIntro>

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

      {userData?.product.role === 'security' && (
        <DescriptionBlock label="Chiavi associate">
          {Boolean(keys.length > 0) ? (
            keys.map(({ key, name }, i) => (
              <StyledLink
                key={i}
                to={buildDynamicPath(routes.SUBSCRIBE_CLIENT_KEY_EDIT.PATH, {
                  clientId,
                  kid: key.kid,
                })}
                sx={{ display: 'block' }}
              >
                {name}
              </StyledLink>
            ))
          ) : (
            <Typography component="span">Nessuna chiave associata</Typography>
          )}
        </DescriptionBlock>
      )}

      <Box sx={{ mt: 8, display: 'flex' }}>
        {getAvailableActions().map(({ onClick, label }, i) => (
          <StyledButton variant="contained" key={i} onClick={onClick}>
            {label}
          </StyledButton>
        ))}
      </Box>
    </React.Fragment>
  )
}

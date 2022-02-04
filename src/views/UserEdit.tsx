import React, { useContext } from 'react'
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
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { USER_PLATFORM_ROLE_LABEL, USER_ROLE_LABEL, USER_STATE_LABEL } from '../config/labels'
import { useUser } from '../hooks/useUser'

type UserEndpoinParams = { clientId: string } | { relationshipId: string }

export function UserEdit() {
  const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()
  const mode = useMode()
  const currentMode = mode as ProviderOrSubscriber
  const { party } = useContext(PartyContext)
  const { isCurrentUser } = useUser()
  const bits = getBits(useLocation())
  const relationshipId = bits[bits.length - 1]

  let clientId: string | undefined = bits[bits.length - 3]
  let endpoint: ApiEndpointKey = 'OPERATOR_SECURITY_GET_SINGLE'
  let endpointParams: UserEndpoinParams = {
    // PIN-1038
    // operatorTaxCode: relationshipId,
    clientId,
  }
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
      // PIN-1038
      mapFn: (data): User => {
        if (mode === 'provider') {
          return data
        }

        return (data as unknown as User[]).find((d) => d.id === relationshipId) as User
      },
    }
  )

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
    // Only admins can handle other people
    // also, if same user, it cannot suspend or reactivate itself
    if (!isAdmin(party) || !userData || isCurrentUser(userData.from)) {
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

  return (
    <React.Fragment>
      <StyledIntro sx={{ mb: 0 }}>{{ title: 'Modifica operatore' }}</StyledIntro>

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
    </React.Fragment>
  )
}

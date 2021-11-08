import React, { useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useLocation } from 'react-router-dom'
import { ActionProps, ApiEndpointKey, User, UserStatus } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { USER_PLATFORM_ROLE_LABEL, USER_ROLE_LABEL, USER_STATUS_LABEL } from '../lib/constants'
import { getBits } from '../lib/url-utils'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext } from '../lib/context'
import { useMode } from '../hooks/useMode'
import { mergeActions } from '../lib/eservice-utils'
import { SecurityOperatorKeys } from '../components/SecurityOperatorKeys'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'

type UserEndpoinParams =
  | { operatorTaxCode: string; clientId: string }
  | { taxCode: string; institutionId: string | undefined }

export function UserEdit() {
  const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()
  const mode = useMode()
  const { party } = useContext(PartyContext)
  const bits = getBits(useLocation())
  const taxCode = bits[bits.length - 1]

  let clientId: string | undefined = bits[bits.length - 3]
  let endpoint: ApiEndpointKey = 'OPERATOR_SECURITY_GET_SINGLE'
  let endpointParams: UserEndpoinParams = { operatorTaxCode: taxCode, clientId }
  const defaultValue: User[] = []
  if (mode === 'provider') {
    clientId = undefined
    endpoint = 'OPERATOR_API_GET_SINGLE'
    endpointParams = { taxCode, institutionId: party?.institutionId }
  }

  const { data } = useAsyncFetch<User, User[]>(
    { path: { endpoint, endpointParams } },
    {
      defaultValue,
      useEffectDeps: [forceRerenderCounter],
      mapFn: (data) => {
        if (mode === 'provider') {
          // TEMP BACKEND: This is horrible, but it is right while waiting for backend-for-frontend
          // Why is it necessary? Because the OPERATOR_API_GET_SINGLE is part of the API that will
          // be shared with self care, that returns an array even for requests on single users.
          // The OPERATOR_SECURITY_GET_SINGLE is internal to PDND interop and has the same structure
          // as admin users. Basically, we should create a stable User type shared across all users
          // of PDND interop and also shared with the self-care portal. While waiting, the frontend
          // fixes it with a temporary hack
          return data as unknown as User[]
        }

        return [data]
      },
      loadingTextLabel: "Stiamo caricando l'operatore richiesto",
    }
  )

  const userData = data.length > 0 ? data[0] : undefined

  /*
   * List of possible actions for the user to perform
   */
  const suspend = async (_: any) => {
    await runAction(
      {
        path: {
          endpoint: 'USER_SUSPEND',
          endpointParams: { taxCode: userData?.taxCode, institutionId: party?.institutionId },
        },
        config: {
          data: { platformRole: mode === 'provider' ? 'api' : 'security' },
        },
      },
      { suppressToast: false }
    )
  }

  const reactivate = async (_: any) => {
    await runAction(
      {
        path: {
          endpoint: 'USER_REACTIVATE',
          endpointParams: { taxCode: userData?.taxCode, institutionId: party?.institutionId },
        },
        config: {
          data: { platformRole: mode === 'provider' ? 'api' : 'security' },
        },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */
  type UserActions = { [key in UserStatus]: ActionProps[] }

  // Build list of available actions for each service in its current state
  const getAvailableActions = () => {
    if (isEmpty(userData) || !isAdmin(party)) {
      return []
    }

    const sharedActions: UserActions = {
      active: [{ onClick: wrapActionInDialog(suspend, 'USER_SUSPEND'), label: 'Sospendi' }],
      suspended: [
        {
          onClick: wrapActionInDialog(reactivate, 'USER_REACTIVATE'),
          label: 'Riattiva',
        },
      ],
      pending: [],
    }

    const providerOnlyActions: UserActions = { active: [], suspended: [], pending: [] }

    const subscriberOnlyActions: UserActions = { active: [], suspended: [], pending: [] }

    const currentActions = { provider: providerOnlyActions, subscriber: subscriberOnlyActions }[
      mode!
    ]

    return mergeActions([sharedActions, currentActions], 'active')
  }

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: `Utente: ${
            userData?.name && userData?.surname ? userData.name + ' ' + userData.surname : 'n/d'
          }`,
        }}
      </StyledIntro>

      <DescriptionBlock label="Codice fiscale">
        <Typography component="span">{userData?.taxCode || userData?.from}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Email">
        <Typography component="span">{userData?.email || 'n/d'}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Ruolo">
        <Typography component="span">
          {userData?.role ? USER_ROLE_LABEL[userData!.role] : 'n/d'}
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Permessi">
        <Typography component="span">
          {userData?.platformRole ? USER_PLATFORM_ROLE_LABEL[userData!.platformRole] : 'n/d'}
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Stato dell'utente">
        <Typography component="span">
          {userData?.status ? USER_STATUS_LABEL[userData!.status] : 'n/d'}
        </Typography>
      </DescriptionBlock>

      <Box sx={{ mt: 4, display: 'flex' }}>
        {getAvailableActions().map(({ onClick, label }, i) => (
          <StyledButton variant="contained" key={i} onClick={onClick}>
            {label}
          </StyledButton>
        ))}
      </Box>

      {clientId && !isEmpty(userData) && (
        <SecurityOperatorKeys clientId={clientId} userData={userData!} />
      )}
    </React.Fragment>
  )
}

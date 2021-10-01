import React, { useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import { Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { ActionWithTooltipBtn, ApiEndpointKey, User, UserStatus } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { USER_PLATFORM_ROLE_LABEL, USER_ROLE_LABEL, USER_STATUS_LABEL } from '../lib/constants'
import { getBits } from '../lib/url-utils'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext } from '../lib/context'
import { useMode } from '../hooks/useMode'
import { mergeActions } from '../lib/eservice-utils'
import { SecurityOperatorKeys } from '../components/SecurityOperatorKeys'

type UserEndpoinParams =
  | { operatorTaxCode: string; clientId: string }
  | { taxCode: string; institutionId: string | undefined }

function UserEditComponent({
  runFakeAction,
  runAction,
  wrapActionInDialog,
  forceRerenderCounter,
}: UserFeedbackHOCProps) {
  const mode = useMode()
  const { party } = useContext(PartyContext)
  const bits = getBits(useLocation())
  const taxCode = bits[bits.length - 1]

  let clientId: string | undefined = bits[bits.length - 2]
  let endpoint: ApiEndpointKey = 'OPERATOR_SECURITY_GET_SINGLE'
  let endpointParams: UserEndpoinParams = { operatorTaxCode: taxCode, clientId }
  const defaultValue: User[] = []
  if (mode === 'provider') {
    clientId = undefined
    endpoint = 'OPERATOR_API_GET_SINGLE'
    endpointParams = { taxCode, institutionId: party?.institutionId }
  }

  const { data, loading } = useAsyncFetch<User, User[]>(
    { path: { endpoint, endpointParams }, config: { method: 'GET' } },
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
    }
  )

  const userData = data.length > 0 ? data[0] : undefined

  /*
   * List of possible actions for the user to perform
   */
  const suspend = () => {
    runFakeAction('Sospendi utente')
  }

  const reactivate = () => {
    runFakeAction('Riattiva utente')
  }
  /*
   * End list of actions
   */
  type UserActions = { [key in UserStatus]: ActionWithTooltipBtn[] }

  // Build list of available actions for each service in its current state
  const getAvailableActions = () => {
    if (isEmpty(userData) || !isAdmin(party)) {
      return []
    }

    const sharedActions: UserActions = {
      active: [{ onClick: wrapActionInDialog(suspend), label: 'Sospendi', isMock: true }],
      suspended: [{ onClick: wrapActionInDialog(reactivate), label: 'Riattiva', isMock: true }],
    }

    const providerOnlyActions: UserActions = { active: [], suspended: [] }

    const subscriberOnlyActions: UserActions = {
      active: [],
      suspended: [],
    }

    const currentActions = { provider: providerOnlyActions, subscriber: subscriberOnlyActions }[
      mode!
    ]

    return mergeActions([sharedActions, currentActions], userData?.status || 'active')
  }

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro priority={2}>
          {{ title: `Utente: ${userData?.name} ${userData?.surname}` }}
        </StyledIntro>

        <DescriptionBlock label="Codice fiscale">
          <span>{userData?.taxCode}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Email">
          <span>{userData?.email || 'n/d'}</span>
        </DescriptionBlock>

        {userData?.role && (
          <DescriptionBlock label="Ruolo">
            <span>{USER_ROLE_LABEL[userData?.role]}</span>
          </DescriptionBlock>
        )}

        {userData?.platformRole && (
          <DescriptionBlock label="Permessi">
            <span>{USER_PLATFORM_ROLE_LABEL[userData?.platformRole]}</span>
          </DescriptionBlock>
        )}

        <DescriptionBlock label="Stato dell'utente">
          <span>{USER_STATUS_LABEL[userData?.status || 'active']}</span>
        </DescriptionBlock>

        <div className="mt-5 d-flex">
          {getAvailableActions().map(({ onClick, label, isMock }, i) => (
            <Button
              key={i}
              className={`me-3${isMock ? ' mockFeature' : ''}`}
              variant={i === 0 ? 'primary' : 'outline-primary'}
              onClick={onClick}
            >
              {label}
            </Button>
          ))}
        </div>
      </WhiteBackground>

      {clientId && !isEmpty(userData) && (
        <SecurityOperatorKeys
          clientId={clientId}
          userData={userData!}
          runAction={runAction}
          forceRerenderCounter={forceRerenderCounter}
          wrapActionInDialog={wrapActionInDialog}
        />
      )}

      {loading && <LoadingOverlay loadingText="Stiamo caricando l'operatore richiesto" />}
    </React.Fragment>
  )
}

export const UserEdit = withUserFeedback(UserEditComponent)

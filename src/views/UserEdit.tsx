import React, { useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import noop from 'lodash/noop'
import merge from 'lodash/merge'
import { Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { ActionWithTooltipBtn, User, UserStatus } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { USER_PLATFORM_ROLE_LABEL, USER_ROLE_LABEL, USER_STATUS_LABEL } from '../lib/constants'
import { getLastBit } from '../lib/url-utils'
import { isAdmin } from '../lib/auth-utils'
import { UserContext } from '../lib/context'
import { useMode } from '../hooks/useMode'

function UserEditComponent({
  runFakeAction,
  wrapActionInDialog,
  forceRerenderCounter,
}: UserFeedbackHOCProps) {
  const mode = useMode()
  const { user } = useContext(UserContext)
  const taxCode = getLastBit(useLocation())
  const endpoint = mode === 'provider' ? 'OPERATOR_API_GET_SINGLE' : 'OPERATOR_SECURITY_GET_SINGLE'
  const { data, loading } = useAsyncFetch<User>(
    {
      path: { endpoint, endpointParams: { taxCode } },
      config: { method: 'GET' },
    },
    { defaultValue: {}, useEffectDeps: [forceRerenderCounter] }
  )

  /*
   * List of possible actions for the user to perform
   */
  const suspend = () => {
    runFakeAction('Sospendi utente')
  }

  const reactivate = () => {
    runFakeAction('Riattiva utente')
  }

  const uploadKey = () => {
    runFakeAction('Carica chiave pubblica')
  }

  const downloadKey = () => {
    runFakeAction('Scarica chiave pubblica')
  }

  const suspendKey = () => {
    runFakeAction('Sospendi chiave pubblica')
  }

  const reactivateKey = () => {
    runFakeAction('Riattiva chiave pubblica')
  }
  /*
   * End list of actions
   */
  type UserActions = { [key in UserStatus]: ActionWithTooltipBtn[] }

  // Build list of available actions for each service in its current state
  const getAvailableActions = () => {
    if (isEmpty(data) || !isAdmin(user)) {
      return []
    }

    const sharedActions: UserActions = {
      active: [{ onClick: wrapActionInDialog(suspend), label: 'Sospendi', isMock: true }],
      suspended: [{ onClick: wrapActionInDialog(reactivate), label: 'Riattiva', isMock: true }],
    }

    const providerOnlyActions: UserActions = { active: [], suspended: [] }

    const subscriberOnlyActions: UserActions = {
      active: [
        { onClick: wrapActionInDialog(uploadKey), label: 'Carica chiave', isMock: true },
        { onClick: wrapActionInDialog(downloadKey), label: 'Scarica chiave', isMock: true },
        { onClick: wrapActionInDialog(suspendKey), label: 'Sospendi chiave', isMock: true },
        { onClick: wrapActionInDialog(reactivateKey), label: 'Riattiva chiave', isMock: true },
      ],
      suspended: [],
    }

    const currentActions = { provider: providerOnlyActions, subscriber: subscriberOnlyActions }[
      mode!
    ]

    return merge(sharedActions, currentActions)[data.status]
  }

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro priority={2} additionalClasses="fakeData fakeDataStart">
          {{ title: `Utente: ${data.name} ${data.surname}` }}
        </StyledIntro>

        <DescriptionBlock label="Codice fiscale">
          <span>{data.taxCode}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Email">
          <span>{data.email}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Ruolo">
          <span>{USER_ROLE_LABEL[data.role]}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Permessi">
          <span>{USER_PLATFORM_ROLE_LABEL[data.platformRole]}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Stato dell'utente">
          <span>{USER_STATUS_LABEL[data.status]}</span>
        </DescriptionBlock>

        {/* Security key handling area */}
        {mode === 'subscriber' && (
          <div className="d-flex">
            <DescriptionBlock label="Chiave pubblica">
              {/* If has key */}
              <Button className="btn-as-link-default me-3" onClick={noop}>
                Scarica la chiave
              </Button>
              <Button className="me-3" variant="primary" onClick={noop}>
                Sospendi/riattiva la chiave
              </Button>
              <Button className="me-3" variant="primary" onClick={noop}>
                Elimina la chiave
              </Button>
              {/* Else */}
              <Button variant="primary" onClick={noop}>
                Carica una chiave pubblica
              </Button>
            </DescriptionBlock>
          </div>
        )}

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

      {loading && <LoadingOverlay loadingText="Stiamo caricando l'operatore richiesto" />}
    </React.Fragment>
  )
}

export const UserEdit = withUserFeedback(UserEditComponent)

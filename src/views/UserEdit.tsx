import React, { useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
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
import { getBits } from '../lib/url-utils'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext } from '../lib/context'
import { useMode } from '../hooks/useMode'
import { mergeActions } from '../lib/eservice-utils'

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
  const clientId = bits[bits.length - 2]
  const endpoint = mode === 'provider' ? 'OPERATOR_API_GET_SINGLE' : 'OPERATOR_SECURITY_GET_SINGLE'
  const endpointParams = mode === 'provider' ? { taxCode } : { operatorTaxCode: taxCode, clientId }

  const { data, loading } = useAsyncFetch<User>(
    { path: { endpoint, endpointParams }, config: { method: 'GET' } },
    { defaultValue: {}, useEffectDeps: [forceRerenderCounter] }
  )

  console.log(data)

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
    const endpointParams = {}
    runAction(
      {
        path: { endpoint: 'OPERATOR_SECURITY_KEY_UPLOAD', endpointParams },
        config: { method: 'POST' },
      },
      { suppressToast: false }
    )
  }

  const downloadKey = () => {
    const endpointParams = {}
    runAction(
      {
        path: { endpoint: 'OPERATOR_SECURITY_KEY_DOWNLOAD', endpointParams },
        config: { method: 'GET' },
      },
      { suppressToast: false }
    )
  }

  const suspendKey = () => {
    const endpointParams = {}
    runAction(
      {
        path: { endpoint: 'OPERATOR_SECURITY_KEY_DISABLE', endpointParams },
        config: { method: 'PATCH' },
      },
      { suppressToast: false }
    )
  }

  const reactivateKey = () => {
    const endpointParams = {}
    runAction(
      {
        path: { endpoint: 'OPERATOR_SECURITY_KEY_ENABLE', endpointParams },
        config: { method: 'PATCH' },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */
  type UserActions = { [key in UserStatus]: ActionWithTooltipBtn[] }

  // Build list of available actions for each service in its current state
  const getAvailableActions = () => {
    if (isEmpty(data) || !isAdmin(party)) {
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

    return mergeActions([sharedActions, currentActions], data.status || 'active')
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
          <span>{data.email || 'n/d'}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Ruolo">
          <span>{USER_ROLE_LABEL[data.role]}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Permessi">
          <span>{USER_PLATFORM_ROLE_LABEL[data.platformRole]}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Stato dell'utente">
          <span>{USER_STATUS_LABEL[data.status || 'active']}</span>
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

      {loading && <LoadingOverlay loadingText="Stiamo caricando l'operatore richiesto" />}
    </React.Fragment>
  )
}

export const UserEdit = withUserFeedback(UserEditComponent)

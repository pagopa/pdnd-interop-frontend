import React from 'react'
import { Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { TableActionBtn, User, UserStatus } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { USER_PLATFORM_ROLE, USER_ROLE, USER_STATUS } from '../lib/constants'
import { getLastBit } from '../lib/url-utils'
import isEmpty from 'lodash/isEmpty'

function UserEditComponent({
  runFakeAction,
  wrapActionInDialog,
  forceUpdateCounter,
}: UserFeedbackHOCProps) {
  const taxCode = getLastBit(useLocation())
  const { data, loading } = useAsyncFetch<User>(
    {
      path: { endpoint: 'USER_GET_SINGLE', endpointParams: { taxCode } },
      config: { method: 'GET' },
    },
    { defaultValue: {}, useEffectDeps: [forceUpdateCounter] }
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
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = () => {
    if (isEmpty(data)) {
      return []
    }

    const actions: { [key in UserStatus]: TableActionBtn[] } = {
      active: [{ onClick: wrapActionInDialog(suspend), label: 'sospendi', isMock: true }],
      suspended: [{ onClick: wrapActionInDialog(reactivate), label: 'riattiva', isMock: true }],
    }

    return actions[data.status]
  }

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro>{{ title: `Utente: ${data.name} ${data.surname}` }}</StyledIntro>

        <DescriptionBlock label="Codice fiscale">
          <span>{data.taxCode}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Email">
          <span>{data.email}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Ruolo">
          <span>{USER_ROLE[data.role!] || 'Operatore'}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Permessi">
          <span>{USER_PLATFORM_ROLE[data.platformRole]}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Stato dell'utente">
          <span>{USER_STATUS[data.status]}</span>
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

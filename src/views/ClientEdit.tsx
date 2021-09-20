import React, { useContext } from 'react'
import { Button } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { Client, ClientStatus, TableActionBtn } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import {
  AGREEMENT_STATUS_LABEL,
  CLIENT_STATUS_LABEL,
  ESERVICE_STATUS_LABEL,
  ROUTES,
} from '../lib/constants'
import { getLastBit } from '../lib/url-utils'
import isEmpty from 'lodash/isEmpty'
import { UserList } from './UserList'
import { getClientComputedStatus } from '../lib/ client-utils'
import { isAdmin } from '../lib/auth-utils'
import { UserContext } from '../lib/context'

function ClientEditComponent({
  runFakeAction,
  wrapActionInDialog,
  forceRerenderCounter,
}: UserFeedbackHOCProps) {
  const { user } = useContext(UserContext)
  const clientId = getLastBit(useLocation())
  const { data, loading } = useAsyncFetch<Client>(
    {
      path: { endpoint: 'CLIENT_GET_SINGLE', endpointParams: { clientId } },
      config: { method: 'GET' },
    },
    { defaultValue: {}, useEffectDeps: [forceRerenderCounter] }
  )

  // TEMP BACKEND should send client status
  if (!isEmpty(data) && !data.status) {
    data.status = 'active'
  }

  /*
   * List of possible actions for the user to perform
   */
  const suspend = () => {
    runFakeAction('Sospendi client')
  }

  const reactivate = () => {
    runFakeAction('Riattiva client')
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = () => {
    if (isEmpty(data) || !isAdmin(user)) {
      return []
    }

    const actions: { [key in ClientStatus]: TableActionBtn[] } = {
      active: [{ onClick: wrapActionInDialog(suspend), label: 'sospendi', isMock: true }],
      suspended: [{ onClick: wrapActionInDialog(reactivate), label: 'riattiva', isMock: true }],
    }

    return actions[data.status]
  }

  const getReasonClientIsBlocked = () => {
    const reasons: string[] = []

    if (
      data.agreement.descriptor.status !== 'published' &&
      data.agreement.descriptor.status !== 'deprecated'
    ) {
      reasons.push("l'erogatore del servizio ha sospeso questa versione")
    }

    if (data.agreement.status !== 'active') {
      reasons.push("l'accordo di interoperabilità relativo al servizio non è attivo")
    }

    if (data.status !== 'active') {
      reasons.push('il client non è attualmente attivo')
    }

    return reasons
  }

  const actions = getAvailableActions()

  return (
    <React.Fragment>
      {!isEmpty(data) && (
        <WhiteBackground>
          <StyledIntro additionalClasses="fakeData fakeDataStart">
            {{ title: `Client: ${data.name}` }}
          </StyledIntro>

          <div style={{ maxWidth: 586 }}>
            <DescriptionBlock label="Descrizione">
              <span>{data.description}</span>
            </DescriptionBlock>

            <DescriptionBlock label="Questo client può accedere al servizio?">
              <span>
                {getClientComputedStatus(data) === 'active'
                  ? 'Sì'
                  : `No, perché ${getReasonClientIsBlocked().join(', ')}`}
              </span>
            </DescriptionBlock>

            <DescriptionBlock label="Stato del client">
              <span>{CLIENT_STATUS_LABEL[data.status]}</span>
            </DescriptionBlock>

            <DescriptionBlock label="La versione del servizio che stai usando">
              <span>
                <Link
                  className="link-default"
                  to={`${ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST.PATH}/${data.eservice.id}/${
                    data.agreement.descriptor.id
                  }`}
                >
                  {data.eservice.name}, versione {data.agreement.descriptor.version}
                </Link>{' '}
                {!!(
                  data.agreement.descriptor.version !== data.eservice.activeDescriptor.version
                ) && (
                  <React.Fragment>
                    (è disponibile una{' '}
                    <Link
                      to={`${ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST.PATH}/${data.eservice.id}/${
                        data.eservice.activeDescriptor.id
                      }`}
                      className="link-default"
                    >
                      versione più recente
                    </Link>
                    )
                  </React.Fragment>
                )}
              </span>
            </DescriptionBlock>

            <DescriptionBlock label="Ente erogatore">
              <span>{data.eservice.provider.description}</span>
            </DescriptionBlock>

            <DescriptionBlock
              label={`Stato del servizio per la versione ${data.agreement.descriptor.version}`}
            >
              <span>{ESERVICE_STATUS_LABEL[data.agreement.descriptor.status]}</span>
            </DescriptionBlock>

            <DescriptionBlock label="Accordo">
              <span>
                <Link
                  className="link-default"
                  to={`${ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_LIST.PATH}/${data.agreement.id}`}
                >
                  Vedi accordo
                </Link>{' '}
                {!!(data.agreement.descriptor.version !== data.eservice.activeDescriptor.version)
                  ? '(questo accordo è aggiornabile)'
                  : ''}
              </span>
            </DescriptionBlock>

            <DescriptionBlock label="Stato dell'accordo">
              <span>{AGREEMENT_STATUS_LABEL[data.agreement.status]}</span>
            </DescriptionBlock>
          </div>

          {actions.length > 0 && (
            <div className="mt-5 d-flex">
              {actions.map(({ onClick, label, isMock }, i) => (
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
          )}
        </WhiteBackground>
      )}

      <UserList />

      {loading && <LoadingOverlay loadingText="Stiamo caricando il client richiesto" />}
    </React.Fragment>
  )
}

export const ClientEdit = withUserFeedback(ClientEditComponent)

import React from 'react'
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

function ClientEditComponent({
  runFakeAction,
  wrapActionInDialog,
  forceRerenderCounter,
}: UserFeedbackHOCProps) {
  const clientId = getLastBit(useLocation())
  const { data, loading } = useAsyncFetch<Client>(
    {
      path: { endpoint: 'CLIENT_GET_SINGLE', endpointParams: { clientId } },
      config: { method: 'GET' },
    },
    { defaultValue: {}, useEffectDeps: [forceRerenderCounter] }
  )

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
    if (isEmpty(data)) {
      return []
    }

    const actions: { [key in ClientStatus]: TableActionBtn[] } = {
      active: [{ onClick: wrapActionInDialog(suspend), label: 'sospendi', isMock: true }],
      suspended: [{ onClick: wrapActionInDialog(reactivate), label: 'riattiva', isMock: true }],
    }

    return actions[data.clientStatus]
  }

  const getReasonClientIsBlocked = () => {
    const reasons: string[] = []

    if (
      data.serviceAgreementStatus !== 'published' &&
      data.serviceAgreementStatus !== 'deprecated'
    ) {
      reasons.push("l'erogatore del servizio ha sospeso questa versione")
    }

    if (data.agreementStatus !== 'active') {
      reasons.push("l'accordo di interoperabilità relativo al servizio non è attivo")
    }

    if (data.clientStatus !== 'active') {
      reasons.push('il client non è attualmente attivo')
    }

    return reasons
  }

  const hasNewVersion = data.serviceAgreementStatus !== data.serviceCurrentStatus
  const isActive = getClientComputedStatus(data) === 'active'

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro additionalClasses="fakeData fakeDataStart">
          {{ title: `Client: ${data.clientName}` }}
        </StyledIntro>

        <div style={{ maxWidth: 586 }}>
          <DescriptionBlock label="Descrizione">
            <span>{data.clientDescription}</span>
          </DescriptionBlock>

          <DescriptionBlock label="Questo client può accedere al servizio?">
            <span>{isActive ? 'Sì' : `No, perché ${getReasonClientIsBlocked().join(', ')}`}</span>
          </DescriptionBlock>

          <DescriptionBlock label="Stato del client">
            <span>{CLIENT_STATUS_LABEL[data.clientStatus]}</span>
          </DescriptionBlock>

          <DescriptionBlock label="La versione del servizio che stai usando">
            <span>
              <Link
                className="link-default"
                to={`${ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST.PATH}/${data.serviceId}/${
                  data.serviceAgreementDescriptorId
                }`}
              >
                {data.serviceName}, versione {data.serviceAgreementVersion}
              </Link>{' '}
              {!!hasNewVersion && (
                <React.Fragment>
                  (è disponibile una{' '}
                  <Link
                    to={`${ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST.PATH}/${data.serviceId}/${
                      data.serviceCurrentDescriptorId
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
            <span>{data.serviceProviderName}</span>
          </DescriptionBlock>

          <DescriptionBlock
            label={`Stato del servizio per la versione ${data.serviceAgreementVersion}`}
          >
            <span>{ESERVICE_STATUS_LABEL[data.serviceAgreementStatus]}</span>
          </DescriptionBlock>

          <DescriptionBlock label="Accordo">
            <span>
              <Link
                className="link-default"
                to={`${ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_LIST.PATH}/${data.agreementId}`}
              >
                Vedi accordo
              </Link>{' '}
              {hasNewVersion ? '(questo accordo è aggiornabile)' : ''}
            </span>
          </DescriptionBlock>

          <DescriptionBlock label="Stato dell'accordo">
            <span>{AGREEMENT_STATUS_LABEL[data.agreementStatus]}</span>
          </DescriptionBlock>
        </div>

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

      <UserList />

      {loading && <LoadingOverlay loadingText="Stiamo caricando il client richiesto" />}
    </React.Fragment>
  )
}

export const ClientEdit = withUserFeedback(ClientEditComponent)

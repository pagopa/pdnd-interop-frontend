import React from 'react'
import { Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { Client, ClientStatus, TableActionBtn } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { AGREEMENT_STATUS_LABEL, ESERVICE_STATUS_LABEL } from '../lib/constants'
import { getLastBit } from '../lib/url-utils'
import isEmpty from 'lodash/isEmpty'

function ClientEditComponent({
  runFakeAction,
  wrapActionInDialog,
  forceUpdateCounter,
}: UserFeedbackHOCProps) {
  const clientId = getLastBit(useLocation())
  const { data, loading } = useAsyncFetch<Client>(
    {
      path: { endpoint: 'CLIENT_GET_SINGLE', endpointParams: { clientId } },
      config: { method: 'GET' },
    },
    { defaultValue: {}, useEffectDeps: [forceUpdateCounter] }
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

    return actions[data.status]
  }

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro>{{ title: `Client: ${data.name}` }}</StyledIntro>

        <DescriptionBlock label="Descrizione">
          <span>{data.description}</span>
        </DescriptionBlock>

        <DescriptionBlock label="E-service">
          <span>
            {data.serviceName}, versione {data.serviceVersion}
          </span>
        </DescriptionBlock>

        <DescriptionBlock label="Ente erogatore">
          <span>{data.providerName}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Stato del servizio">
          <span>{ESERVICE_STATUS_LABEL[data.serviceStatus]}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Stato dell'accordo">
          <span>{AGREEMENT_STATUS_LABEL[data.agreementStatus]}</span>
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

      <WhiteBackground>
        <StyledIntro>
          {{
            title: 'I tuoi operatori di sicurezza',
            description:
              'In quest’area puoi trovare e gestire tutti gli operatori di sicurezza che sono stati abilitati a gestire le chiavi per il tuo client',
          }}
        </StyledIntro>

        <Button variant="primary" className="mockFeature">
          aggiungi nuovo operatore
        </Button>
      </WhiteBackground>

      {loading && <LoadingOverlay loadingText="Stiamo caricando il tuo client" />}
    </React.Fragment>
  )
}

export const ClientEdit = withUserFeedback(ClientEditComponent)

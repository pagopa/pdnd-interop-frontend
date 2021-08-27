import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { AgreementStatus, AgreementSummary, ApiEndpointKey } from '../../types'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { AGREEMENT_STATUS, ROUTES } from '../lib/constants'
import { getLastBit } from '../lib/url-utils'
import capitalize from 'lodash/capitalize'
import isEmpty from 'lodash/isEmpty'
import { useMode } from '../hooks/useMode'
import { fetchWithLogs } from '../lib/api-utils'

export function AgreementEdit() {
  const mode = useMode()
  const [actionLoading, setActionLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("Stiamo caricando l'accordo richiesto")
  const [actions, setActions] = useState<any[]>()
  const agreementId = getLastBit(useLocation())
  const { data, loading: dataLoading } = useAsyncFetch<AgreementSummary>(
    {
      path: {
        endpoint: 'AGREEMENT_GET_SINGLE',
        endpointParams: { agreementId },
      },
      config: { method: 'GET' },
    },
    {}
  )

  const Subtitle = ({ label }: { label: string }) => (
    <React.Fragment>
      <strong>{label}</strong>
      <br />
    </React.Fragment>
  )

  const runPatchAction = async (endpoint: ApiEndpointKey, feedbackText: string) => {
    setActionLoading(true)
    setLoadingText(feedbackText)
    await fetchWithLogs({ endpoint }, { method: 'PATCH' })
    setActionLoading(false)
  }

  const activate = async () => {
    await runPatchAction('AGREEMENT_ACTIVATE', "Stiamo attivando l'accordo")
  }

  const reactivate = () => {
    alert('Riattiva accordo: questa funzionalità sarà disponibile a breve')
  }

  const refuse = () => {
    alert('Rifiuta accordo: questa funzionalità sarà disponibile a breve')
  }

  const suspend = async () => {
    await runPatchAction('AGREEMENT_SUSPEND', "Stiamo attivando l'accordo")
  }

  const archive = () => {
    alert('Archivia accordo: questa funzionalità sarà disponibile a breve')
  }

  const buildVerify = (attributeId: string) => async (_: any) => {
    setActionLoading(true)
    setLoadingText("Stiamo verificando l'attributo")
    await fetchWithLogs(
      {
        endpoint: 'AGREEMENT_VERIFY_ATTRIBUTE',
        endpointParams: { agreementId: data!.id, attributeId },
      },
      {
        method: 'PATCH',
      }
    )
    setActionLoading(false)
  }

  const getAvailableActions = () => {
    if (isEmpty(data) || !data.status) {
      return
    }

    const providerActions: { [key in AgreementStatus]: any[] } = {
      pending: [
        { onClick: activate, label: 'attiva' },
        { onClick: refuse, label: 'rifiuta' },
      ],
      active: [{ onClick: suspend, label: 'sospendi' }],
      suspended: [
        { onClick: reactivate, label: 'riattiva' },
        { onClick: archive, label: 'archivia' },
      ],
    }

    const subscriberActions: { [key in AgreementStatus]: any[] } = {
      active: [{ onClick: suspend, label: 'sospendi' }],
      suspended: [{ onClick: reactivate, label: 'riattiva' }],
      pending: [],
    }

    const actions = {
      provider: providerActions,
      subscriber: subscriberActions,
    }[mode!]

    return actions[data!.status]
  }

  useEffect(() => {
    setActions(getAvailableActions())
  }, [mode, data]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LoadingOverlay isLoading={dataLoading || actionLoading} loadingText={loadingText}>
      <WhiteBackground>
        <StyledIntro>{{ title: `Accordo: ${data?.id}` }}</StyledIntro>
        <p>
          <Subtitle label="E-service" />
          <Link
            className="link-default"
            to={`${ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH}/${data?.eserviceId}`}
          >
            Nome e-service
          </Link>
        </p>

        <p>
          <Subtitle label="Stato dell'accordo" />
          <span>{capitalize(AGREEMENT_STATUS[data?.status])}</span>
        </p>

        <div className="mb-3">
          <Subtitle label="Attributi" />
          {data?.verifiedAttributes?.map((attribute, i) => {
            return (
              <div
                key={i}
                className="w-100 d-flex justify-content-between"
                style={{ maxWidth: 500 }}
              >
                <span>{attribute.name || attribute.id}</span>
                {attribute.verified ? (
                  <div className="text-primary d-flex align-items-center">
                    <i className="text-primary fs-5 bi bi-check me-2" />
                    <span>verificato</span>
                  </div>
                ) : mode === 'provider' ? (
                  <Button variant="primary" onClick={buildVerify(attribute.id)}>
                    verifica
                  </Button>
                ) : (
                  <span>in attesa</span>
                )}
              </div>
            )
          })}
        </div>

        {mode === 'provider' && (
          <p>
            <Subtitle label="Ente fruitore" />
            <span>{data?.consumerName || data?.consumerId}</span>
          </p>
        )}

        {actions && (
          <div className="mt-5 d-flex">
            {actions.map(({ onClick, label }, i) => (
              <Button
                key={i}
                className="me-3"
                variant={i === 0 ? 'primary' : 'outline-primary'}
                onClick={onClick}
              >
                {label}
              </Button>
            ))}
          </div>
        )}
      </WhiteBackground>

      {mode === 'subscriber' && (
        <WhiteBackground>
          <StyledIntro>{{ title: 'Client associati' }}</StyledIntro>
          <Button variant="primary">associa nuovo client</Button>
          <p>lista dei client</p>
        </WhiteBackground>
      )}
    </LoadingOverlay>
  )
}

import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { AgreementStatus, AgreementSummary, ApiEndpointKey, ToastContent } from '../../types'
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
import { ConfirmationDialogOverlay } from '../components/ConfirmationDialogOverlay'
import { StyledToast } from '../components/StyledToast'
import { showTempAlert } from '../lib/wip-utils'
import { formatDate, getRandomDate } from '../lib/date-utils'

export function AgreementEdit() {
  const mode = useMode()
  const [actionLoading, setActionLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("Stiamo caricando l'accordo richiesto")
  const [actions, setActions] = useState<any[]>()
  const agreementId = getLastBit(useLocation())
  const [modal, setModal] = useState<any>()
  const [toast, setToast] = useState<ToastContent>()
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

  console.log(data)

  const Subtitle = ({ label }: { label: string }) => (
    <React.Fragment>
      <strong>{label}</strong>
      <br />
    </React.Fragment>
  )

  const runPatchAction = async (endpoint: ApiEndpointKey, feedbackText: string) => {
    setActionLoading(true)
    setLoadingText(feedbackText)
    await fetchWithLogs({ endpoint, endpointParams: { agreementId } }, { method: 'PATCH' })
    setActionLoading(false)
  }

  const activate = async () => {
    await runPatchAction('AGREEMENT_ACTIVATE', "Stiamo attivando l'accordo")
    showToast()
  }

  const reactivate = () => {
    showTempAlert('Riattiva accordo')
    closeModal()
    showToast()
  }

  const refuse = () => {
    showTempAlert('Rifiuta accordo')
    closeModal()
    showToast()
  }

  const suspend = async () => {
    await runPatchAction('AGREEMENT_SUSPEND', "Stiamo sospendendo l'accordo")
    showToast()
  }

  const archive = () => {
    showTempAlert('Archivia accordo')
    closeModal()
    showToast()
  }

  const closeModal = () => {
    setModal(undefined)
  }

  const showToast = () => {
    setToast({
      title: 'Operazione conclusa',
      description: 'Operazione conclusa con successo',
      onClose: closeToast,
    })
  }

  const closeToast = () => {
    setToast(undefined)
  }

  const buildWrapAction = (proceedCallback: VoidFunction) => async (_: any) => {
    setModal({ proceedCallback, close: closeModal })
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
        { proceedCallback: activate, label: 'attiva' },
        { proceedCallback: refuse, label: 'rifiuta', isMock: true },
      ],
      active: [{ onClick: suspend, label: 'sospendi' }],
      suspended: [
        { proceedCallback: reactivate, label: 'riattiva', isMock: true },
        { proceedCallback: archive, label: 'archivia', isMock: true },
      ],
    }

    const subscriberActions: { [key in AgreementStatus]: any[] } = {
      active: [{ proceedCallback: suspend, label: 'sospendi' }],
      suspended: [{ proceedCallback: reactivate, label: 'riattiva', isMock: true }],
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
    <React.Fragment>
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
              const randomDate = getRandomDate(new Date(2022, 0, 1), new Date(2023, 0, 1))
              return (
                <div
                  key={i}
                  className="w-100 d-flex justify-content-between"
                  style={{ maxWidth: 768 }}
                >
                  <span>{attribute.name || attribute.id}</span>
                  <span className="fakeData">Scadenza: {formatDate(randomDate)}</span>
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
              {actions.map(({ proceedCallback, label, isMock }, i) => (
                <Button
                  key={i}
                  className={`me-3${isMock ? ' mockFeature' : ''}`}
                  variant={i === 0 ? 'primary' : 'outline-primary'}
                  onClick={buildWrapAction(proceedCallback)}
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
            <Button className="mockFeature" variant="primary">
              associa nuovo client
            </Button>
            <p>lista dei client</p>
          </WhiteBackground>
        )}
      </LoadingOverlay>
      {modal && <ConfirmationDialogOverlay {...modal} />}
      {toast && <StyledToast {...toast} />}
    </React.Fragment>
  )
}

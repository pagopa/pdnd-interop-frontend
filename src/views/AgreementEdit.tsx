import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { AgreementStatus, AgreementSummary } from '../../types'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { AGREEMENT_STATUS, ROUTES } from '../lib/constants'
import { getLastBit } from '../lib/url-utils'
import capitalize from 'lodash/capitalize'
import { useMode } from '../hooks/useMode'
import { formatDate, getRandomDate } from '../lib/date-utils'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'

function AgreementEditComponent({
  runAction,
  runFakeAction,
  forceUpdateCounter,
  wrapActionInDialog,
}: UserFeedbackHOCProps) {
  const mode = useMode()
  const agreementId = getLastBit(useLocation())
  const { data, loading } = useAsyncFetch<AgreementSummary>(
    {
      path: { endpoint: 'AGREEMENT_GET_SINGLE', endpointParams: { agreementId } },
      config: { method: 'GET' },
    },
    { defaultValue: {}, useEffectDeps: [forceUpdateCounter, mode] }
  )

  /*
   * List of possible actions for the user to perform
   */
  const activate = async () => {
    await runAction({
      path: { endpoint: 'AGREEMENT_ACTIVATE', endpointParams: { agreementId } },
      config: { method: 'PATCH' },
    })
  }

  const suspend = async () => {
    await runAction({
      path: { endpoint: 'AGREEMENT_SUSPEND', endpointParams: { agreementId } },
      config: { method: 'PATCH' },
    })
  }

  const reactivate = () => {
    runFakeAction('Riattiva accordo')
  }

  const refuse = () => {
    runFakeAction('Rifiuta accordo')
  }

  const archive = () => {
    runFakeAction('Archivia accordo')
  }

  const wrapVerify = (attributeId: string) => async (_: any) => {
    await runAction({
      path: {
        endpoint: 'AGREEMENT_VERIFY_ATTRIBUTE',
        endpointParams: { agreementId: data!.id, attributeId },
      },
      config: { method: 'PATCH' },
    })
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each agreement in its current state
  const getAvailableActions = () => {
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

    const actions = { provider: providerActions, subscriber: subscriberActions }[mode!]

    return actions[data!.status]
  }

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro>{{ title: `Accordo: ${data?.id}` }}</StyledIntro>

        <DescriptionBlock label="E-service">
          <Link
            className="link-default"
            to={`${ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH}/${data?.eserviceId}`}
          >
            Nome e-service
          </Link>
        </DescriptionBlock>

        <DescriptionBlock label="Stato dell'accordo">
          <span>{capitalize(AGREEMENT_STATUS[data?.status])}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Attributi">
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
                  <Button variant="primary" onClick={wrapVerify(attribute.id)}>
                    verifica
                  </Button>
                ) : (
                  <span>in attesa</span>
                )}
              </div>
            )
          })}
        </DescriptionBlock>

        {mode === 'provider' && (
          <DescriptionBlock label="Ente fruitore">
            <span>{data?.consumerName || data?.consumerId}</span>
          </DescriptionBlock>
        )}

        <div className="mt-5 d-flex">
          {getAvailableActions().map(({ proceedCallback, label, isMock }, i) => (
            <Button
              key={i}
              className={`me-3${isMock ? ' mockFeature' : ''}`}
              variant={i === 0 ? 'primary' : 'outline-primary'}
              onClick={wrapActionInDialog(proceedCallback)}
            >
              {label}
            </Button>
          ))}
        </div>
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

      {loading && <LoadingOverlay loadingText="Stiamo caricando l'accordo richiesto" />}
    </React.Fragment>
  )
}

export const AgreementEdit = withUserFeedback(AgreementEditComponent)

import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import has from 'lodash/has'
import {
  AgreementStatus,
  AgreementSummary,
  ActionWithTooltipBtn,
  SingleBackendAttribute,
  GroupBackendAttribute,
} from '../../types'
import { AGREEMENT_STATUS_LABEL, ROUTES } from '../lib/constants'
import { buildDynamicPath, getLastBit } from '../lib/url-utils'
import { formatDate, getRandomDate } from '../lib/date-utils'
import { mergeActions } from '../lib/eservice-utils'
import { useMode } from '../hooks/useMode'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { PartyContext } from '../lib/context'
import { getAgreementStatus } from '../lib/status-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'

export function AgreementEdit() {
  const {
    runAction,
    runFakeAction,
    runActionWithDestination,
    forceRerenderCounter,
    wrapActionInDialog,
  } = useFeedback()
  const mode = useMode()
  const agreementId = getLastBit(useLocation())
  const { party } = useContext(PartyContext)
  const { data } = useAsyncFetch<AgreementSummary>(
    {
      path: { endpoint: 'AGREEMENT_GET_SINGLE', endpointParams: { agreementId } },
    },
    {
      useEffectDeps: [forceRerenderCounter, mode],
      loadingTextLabel: "Stiamo caricando l'accordo richiesto",
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const activate = async () => {
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_ACTIVATE',
          endpointParams: { agreementId, partyId: party!.partyId },
        },
      },
      { suppressToast: false }
    )
  }

  const suspend = async () => {
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_SUSPEND',
          endpointParams: { agreementId, partyId: party!.partyId },
        },
      },
      { suppressToast: false }
    )
  }

  const upgrade = async () => {
    await runActionWithDestination(
      {
        path: { endpoint: 'AGREEMENT_UPGRADE', endpointParams: { agreementId } },
      },
      { destination: ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_LIST, suppressToast: false }
    )
  }

  const refuse = () => {
    runFakeAction('Rifiuta accordo')
  }

  const archive = () => {
    runFakeAction('Archivia accordo')
  }

  const wrapVerify = (attributeId: string) => async (_: any) => {
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_VERIFY_ATTRIBUTE',
          endpointParams: { agreementId: data!.id, attributeId },
        },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  type AgreementActions = { [key in AgreementStatus]: ActionWithTooltipBtn[] }
  // Build list of available actions for each agreement in its current state
  const getAvailableActions = () => {
    if (!data) {
      return []
    }

    const sharedActions: AgreementActions = {
      active: [{ onClick: wrapActionInDialog(suspend, 'AGREEMENT_SUSPEND'), label: 'sospendi' }],
      suspended: [
        {
          onClick: wrapActionInDialog(activate, 'AGREEMENT_ACTIVATE'),
          label: 'riattiva',
        },
      ],
      pending: [],
      inactive: [],
    }

    const providerOnlyActions: AgreementActions = {
      active: [],
      pending: [
        { onClick: wrapActionInDialog(activate, 'AGREEMENT_ACTIVATE'), label: 'attiva' },
        { onClick: wrapActionInDialog(refuse), label: 'rifiuta', isMock: true },
      ],
      suspended: [{ onClick: wrapActionInDialog(archive), label: 'archivia', isMock: true }],
      inactive: [],
    }

    const subscriberOnlyActionsActive: ActionWithTooltipBtn[] = []
    if (
      data.eservice.activeDescriptor &&
      data.eservice.activeDescriptor.version > data.eservice.version
    ) {
      subscriberOnlyActionsActive.push({
        onClick: wrapActionInDialog(upgrade, 'AGREEMENT_UPGRADE'),
        label: 'aggiorna',
      })
    }

    const subscriberOnlyActions: AgreementActions = {
      active: subscriberOnlyActionsActive,
      suspended: [],
      pending: [],
      inactive: [],
    }

    const currentActions = { provider: providerOnlyActions, subscriber: subscriberOnlyActions }[
      mode!
    ]

    const status = data ? getAgreementStatus(data, mode) : 'suspended'

    return mergeActions<AgreementActions>([currentActions, sharedActions], status)
  }

  const SingleAttribute = ({
    name,
    verified,
    id,
  }: {
    name?: string | undefined
    verified?: boolean
    id: string
  }) => {
    const randomDate = getRandomDate(new Date(2022, 0, 1), new Date(2023, 0, 1))

    return (
      <div className="d-flex justify-content-between align-items-center">
        <span>
          {name}, con <span className="fakeData">scadenza {formatDate(randomDate)}</span>
        </span>

        {typeof verified === 'boolean' ? (
          verified ? (
            <div className="text-primary d-flex align-items-center my-1">
              <i className="text-primary fs-5 bi bi-check me-2" />
              <span>verificato</span>
            </div>
          ) : (
            <span>rifiutato dall'erogatore</span>
          )
        ) : mode === 'provider' ? (
          <StyledButton variant="primary" onClick={wrapVerify(id)}>
            verifica
          </StyledButton>
        ) : (
          <span>in attesa di verifica</span>
        )}
      </div>
    )
  }

  const agreementSuspendExplanation =
    "L'accordo può essere sospeso sia dall'erogatore che dal fruitore dell'e-service. Se almeno uno dei due attori lo sospende, inibirà l'accesso all'e-service a tutti i client associati all'e-service dal fruitore"

  return (
    <WhiteBackground>
      <StyledIntro priority={2}>{{ title: 'Accordo di interoperabilità' }}</StyledIntro>

      <DescriptionBlock label="Accordo relativo a">
        <div style={{ maxWidth: 500 }}>
          <Link
            className="link-default"
            to={buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_VIEW.PATH, {
              eserviceId: data?.eservice.id,
              descriptorId: data?.eserviceDescriptorId,
            })}
          >
            {data?.eservice.name}, versione {data?.eservice.version}
          </Link>
          {mode === 'subscriber' &&
          data?.eservice.activeDescriptor &&
          data?.status !== 'inactive' ? (
            <React.Fragment>
              {' '}
              (è disponibile una{' '}
              <Link
                className="link-default"
                to={buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_VIEW.PATH, {
                  eserviceId: data?.eservice.id,
                  descriptorId: data?.eservice.activeDescriptor.id,
                })}
              >
                versione più recente
              </Link>
              ; per attivarla, aggiorna l'accordo di interoperabilità)
            </React.Fragment>
          ) : null}
        </div>
      </DescriptionBlock>

      <DescriptionBlock label="Stato dell'accordo" tooltipLabel={agreementSuspendExplanation}>
        {data?.status === 'suspended' ? (
          <React.Fragment>
            <span>
              Lato erogatore: {AGREEMENT_STATUS_LABEL[getAgreementStatus(data, 'provider')]}
            </span>
            <br />
            <span>
              Lato fruitore: {AGREEMENT_STATUS_LABEL[getAgreementStatus(data, 'subscriber')]}
            </span>
          </React.Fragment>
        ) : (
          <span>{AGREEMENT_STATUS_LABEL[data?.status]}</span>
        )}
      </DescriptionBlock>

      <DescriptionBlock label="Attributi">
        <div className="mt-1">
          {data?.attributes.length > 0 ? (
            data?.attributes.map((backendAttribute, i) => {
              let attributesToDisplay: any

              if (has(backendAttribute, 'single')) {
                const { single } = backendAttribute as SingleBackendAttribute
                attributesToDisplay = <SingleAttribute {...single} />
              } else {
                const { group } = backendAttribute as GroupBackendAttribute
                attributesToDisplay = group.map((a, j) => {
                  if (j === group.length - 1) {
                    return <SingleAttribute key={j} {...a} />
                  }

                  return (
                    <React.Fragment key={j}>
                      <SingleAttribute {...a} />
                      <em>oppure</em>
                    </React.Fragment>
                  )
                })
              }

              return (
                <div
                  key={i}
                  className="w-100 border-bottom border-secondary mb-2 pb-2"
                  style={{ maxWidth: 768 }}
                >
                  {attributesToDisplay}
                </div>
              )
            })
          ) : (
            <span>Per questo e-service non sono stati richiesti attributi</span>
          )}
        </div>
      </DescriptionBlock>

      {mode === 'provider' && (
        <DescriptionBlock label="Ente fruitore">
          <span>{data?.consumer.name}</span>
        </DescriptionBlock>
      )}

      <div className="mt-5 d-flex">
        {getAvailableActions().map(({ onClick, label, isMock }, i) => (
          <StyledButton
            key={i}
            className={`me-3${isMock ? ' mockFeature' : ''}`}
            variant={i === 0 ? 'primary' : 'outline-primary'}
            onClick={onClick}
          >
            {label}
          </StyledButton>
        ))}
      </div>
    </WhiteBackground>
  )
}

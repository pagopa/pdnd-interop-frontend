import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty'
import compose from 'lodash/fp/compose'
import { AxiosResponse } from 'axios'
import {
  AgreementStatus,
  AgreementSummary,
  ActionWithTooltipBtn,
  EServiceReadType,
  EServiceDescriptorRead,
  SingleBackendAttribute,
  GroupBackendAttribute,
} from '../../types'
import { AGREEMENT_STATUS_LABEL, ROUTES } from '../lib/constants'
import { getLastBit } from '../lib/url-utils'
import { formatDate, getRandomDate } from '../lib/date-utils'
import { fetchWithLogs } from '../lib/api-utils'
import { getFetchOutcome } from '../lib/error-utils'
import { mergeActions } from '../lib/eservice-utils'
import { useMode } from '../hooks/useMode'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { withAdminAuth } from '../components/withAdminAuth'
import { PartyContext } from '../lib/context'

function AgreementEditComponent({
  runAction,
  runFakeAction,
  runActionWithDestination,
  forceRerenderCounter,
  wrapActionInDialog,
}: UserFeedbackHOCProps) {
  const mode = useMode()
  const agreementId = getLastBit(useLocation())
  const { party } = useContext(PartyContext)
  const [mostRecent, setMostRecent] = useState<EServiceDescriptorRead | undefined>()
  const [current, setCurrent] = useState<EServiceDescriptorRead | undefined>()
  const { data, loading } = useAsyncFetch<AgreementSummary>(
    {
      path: { endpoint: 'AGREEMENT_GET_SINGLE', endpointParams: { agreementId } },
      config: { method: 'GET' },
    },
    { defaultValue: {}, useEffectDeps: [forceRerenderCounter, mode] }
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
        config: { method: 'PATCH' },
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
        config: { method: 'PATCH' },
      },
      { suppressToast: false }
    )
  }

  const upgrade = async () => {
    await runActionWithDestination(
      {
        path: { endpoint: 'AGREEMENT_UPGRADE', endpointParams: { agreementId } },
        config: { method: 'POST' },
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
        config: { method: 'PATCH' },
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
    if (isEmpty(data)) {
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
    }

    const providerOnlyActions: AgreementActions = {
      active: [],
      pending: [
        { onClick: wrapActionInDialog(activate, 'AGREEMENT_ACTIVATE'), label: 'attiva' },
        { onClick: wrapActionInDialog(refuse), label: 'rifiuta', isMock: true },
      ],
      suspended: [{ onClick: wrapActionInDialog(archive), label: 'archivia', isMock: true }],
    }

    const subscriberOnlyActionsActive: ActionWithTooltipBtn[] = []
    if (mostRecent && current && mostRecent.version > current.version) {
      subscriberOnlyActionsActive.push({
        onClick: wrapActionInDialog(upgrade, 'AGREEMENT_UPGRADE'),
        label: 'aggiorna',
      })
    }

    const subscriberOnlyActions: AgreementActions = {
      active: subscriberOnlyActionsActive,
      suspended: [],
      pending: [],
    }

    const currentActions = { provider: providerOnlyActions, subscriber: subscriberOnlyActions }[
      mode!
    ]

    const status = mode === 'provider' ? 'status' : 'status'

    return mergeActions<AgreementActions>([currentActions, sharedActions], data[status])
  }

  /*
   * Check if there is a more recent version of this service
   */
  useEffect(() => {
    async function asyncFetchEService() {
      const resp = await fetchWithLogs(
        { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId: data?.eservice?.id } },
        { method: 'GET' }
      )

      const outcome = getFetchOutcome(resp)

      if (outcome === 'success') {
        const eserviceData = (resp as AxiosResponse).data
        setMostRecentVersion(eserviceData)
      }
    }

    if (!isEmpty(data) && mode === 'subscriber') {
      asyncFetchEService()
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  const setMostRecentVersion = (eserviceData: EServiceReadType) => {
    const descriptorsSortedByVersion = eserviceData.descriptors.sort(
      (a: EServiceDescriptorRead, b: EServiceDescriptorRead) => (+a.version > +b.version ? -1 : 1)
    )
    const mostRecentDescriptor = descriptorsSortedByVersion[0]
    const currentDescriptor = eserviceData.descriptors.find(
      (d) => d.version === data?.eservice?.version
    )

    const currentVersion = +data?.eservice?.version
    const mostRecentVersion = +mostRecentDescriptor.version

    setCurrent(currentDescriptor)
    if (mostRecentVersion > currentVersion && mostRecentDescriptor.status !== 'draft') {
      setMostRecent(mostRecentDescriptor)
    }
  }

  const SingleAttribute = ({
    name,
    verified,
    id,
  }: {
    name?: string | undefined
    verified: boolean
    id: string
  }) => {
    const randomDate = getRandomDate(new Date(2022, 0, 1), new Date(2023, 0, 1))

    return (
      <div className="d-flex justify-content-between align-items-center">
        <span>
          {name}, con <span className="fakeData">scadenza {formatDate(randomDate)}</span>
        </span>

        {verified ? (
          <div className="text-primary d-flex align-items-center my-1">
            <i className="text-primary fs-5 bi bi-check me-2" />
            <span>verificato</span>
          </div>
        ) : mode === 'provider' ? (
          <Button variant="primary" onClick={wrapVerify(id)}>
            verifica
          </Button>
        ) : (
          <span>in attesa</span>
        )}
      </div>
    )
  }

  const agreementSuspendExplanation =
    "L'accordo può essere sospeso sia dall'erogatore che dal fruitore dell'e-service. Se almeno uno dei due attori lo sospende, inibirà l'accesso all'e-service a tutti i client associati all'e-service dal fruitore"

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro priority={2}>{{ title: 'Accordo di interoperabilità' }}</StyledIntro>

        <DescriptionBlock label="Accordo relativo a">
          <div style={{ maxWidth: 500 }}>
            <Link
              className="link-default"
              to={`${ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST.PATH}/${data?.eservice?.id}/${
                current?.id
              }`}
            >
              {data?.eservice?.name}, versione {data?.eservice?.version}
            </Link>
            {mode === 'subscriber' && mostRecent ? (
              <React.Fragment>
                {' '}
                (è disponibile una{' '}
                <Link
                  className="link-default"
                  to={`${ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST.PATH}/${data?.eservice?.id}/${
                    mostRecent.id
                  }`}
                >
                  versione più recente
                </Link>
                ; per attivarla, aggiorna l'accordo di interoperabilità)
              </React.Fragment>
            ) : null}
          </div>
        </DescriptionBlock>

        <DescriptionBlock label="Stato dell'accordo" tooltipLabel={agreementSuspendExplanation}>
          <span>Lato erogatore: {AGREEMENT_STATUS_LABEL[data?.status]}</span>
          <br />
          <span>Lato fruitore: {AGREEMENT_STATUS_LABEL[data?.status]}</span>
        </DescriptionBlock>

        <DescriptionBlock label="Attributi">
          <div className="mt-1">
            {data?.attributes?.length > 0 ? (
              data?.attributes?.map((backendAttribute, i) => {
                let attributesToDisplay: any

                if (has(backendAttribute, 'single')) {
                  const { single } = backendAttribute as SingleBackendAttribute
                  attributesToDisplay = <SingleAttribute {...single} />
                } else {
                  const { group } = backendAttribute as GroupBackendAttribute
                  attributesToDisplay = group.map((a, j) => {
                    if (j === group.length - 1) {
                      return <SingleAttribute {...a} />
                    }

                    return (
                      <React.Fragment>
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
            <span>{data?.consumer?.name}</span>
          </DescriptionBlock>
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

      {loading && <LoadingOverlay loadingText="Stiamo caricando l'accordo richiesto" />}
    </React.Fragment>
  )
}

export const AgreementEdit = compose(withUserFeedback, withAdminAuth)(AgreementEditComponent)

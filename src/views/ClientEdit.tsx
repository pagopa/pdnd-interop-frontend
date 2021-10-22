import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Client, ClientStatus, ActionWithTooltipBtn } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import {
  AGREEMENT_STATUS_LABEL,
  CLIENT_STATUS_LABEL,
  ESERVICE_STATUS_LABEL,
  ROUTES,
} from '../lib/constants'
import { buildDynamicPath, getLastBit } from '../lib/url-utils'
import isEmpty from 'lodash/isEmpty'
import { UserList } from './UserList'
import { getClientComputedStatus } from '../lib/status-utils'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext } from '../lib/context'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'

export function ClientEdit() {
  const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()
  const { party } = useContext(PartyContext)
  const clientId = getLastBit(useLocation())
  const { data } = useAsyncFetch<Client>(
    {
      path: { endpoint: 'CLIENT_GET_SINGLE', endpointParams: { clientId } },
    },
    {
      defaultValue: {},
      useEffectDeps: [forceRerenderCounter],
      loadingTextLabel: 'Stiamo caricando il client richiesto',
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const suspend = async () => {
    await runAction(
      {
        path: { endpoint: 'CLIENT_SUSPEND', endpointParams: { clientId: data.id } },
      },
      { suppressToast: false }
    )
  }

  const reactivate = async () => {
    await runAction(
      {
        path: { endpoint: 'CLIENT_ACTIVATE', endpointParams: { clientId: data.id } },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = () => {
    if (isEmpty(data) || !isAdmin(party)) {
      return []
    }

    const actions: { [key in ClientStatus]: ActionWithTooltipBtn[] } = {
      active: [{ onClick: wrapActionInDialog(suspend, 'CLIENT_SUSPEND'), label: 'sospendi' }],
      suspended: [
        { onClick: wrapActionInDialog(reactivate, 'CLIENT_ACTIVATE'), label: 'riattiva' },
      ],
    }

    return actions[data.status]
  }

  const getReasonClientIsBlocked = () => {
    const reasons: string[] = []

    if (
      data.agreement.descriptor.status !== 'published' &&
      data.agreement.descriptor.status !== 'deprecated'
    ) {
      reasons.push("l'erogatore dell'e-service ha sospeso questa versione")
    }

    if (data.agreement.status !== 'active') {
      reasons.push("l'accordo di interoperabilità relativo all'e-service non è attivo")
    }

    if (data.status !== 'active') {
      reasons.push('il client non è attivo')
    }

    return reasons
  }

  const actions = getAvailableActions()

  return (
    <React.Fragment>
      {!isEmpty(data) && (
        <WhiteBackground>
          <StyledIntro priority={2}>{{ title: `Client: ${data.name}` }}</StyledIntro>

          <div style={{ maxWidth: 586 }}>
            <DescriptionBlock label="Descrizione">
              <span>{data.description}</span>
            </DescriptionBlock>

            <DescriptionBlock label="Questo client può accedere all'e-service?">
              <span>
                {getClientComputedStatus(data) === 'active'
                  ? 'Sì'
                  : `No: ${getReasonClientIsBlocked().join(', ')}`}
              </span>
            </DescriptionBlock>

            <DescriptionBlock label="Stato del client">
              <span>{CLIENT_STATUS_LABEL[data.status]}</span>
            </DescriptionBlock>

            <DescriptionBlock label="La versione dell'e-service che stai usando">
              <span>
                <Link
                  className="link-default"
                  to={buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_VIEW.PATH, {
                    eserviceId: data.eservice.id,
                    descriptorId: data.agreement.descriptor.id,
                  })}
                >
                  {data.eservice.name}, versione {data.agreement.descriptor.version}
                </Link>{' '}
                {!!(
                  data.eservice.activeDescriptor &&
                  data.agreement.descriptor.version !== data.eservice.activeDescriptor.version
                ) && (
                  <p className="mt-2">
                    È disponibile una versione più recente
                    <br />
                    <Link
                      to={buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_VIEW.PATH, {
                        eserviceId: data.eservice.id,
                        descriptorId: data.eservice.activeDescriptor.id,
                      })}
                      className="link-default"
                    >
                      Vedi il contenuto della nuova versione
                    </Link>
                    <br />
                    <Link
                      className="link-default"
                      to={buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_EDIT.PATH, {
                        id: data.agreement.id,
                      })}
                    >
                      Vai alla pagina dell'accordo
                    </Link>{' '}
                    (da lì potrai aggiornarlo)
                  </p>
                )}
              </span>
            </DescriptionBlock>

            <DescriptionBlock label="Ente erogatore">
              <span>{data.eservice.provider.description}</span>
            </DescriptionBlock>

            <DescriptionBlock
              label={`Stato dell'e-service per la versione ${data.agreement.descriptor.version}`}
            >
              <span>{ESERVICE_STATUS_LABEL[data.agreement.descriptor.status]}</span>
            </DescriptionBlock>

            <DescriptionBlock label="Accordo">
              <span>
                <Link
                  className="link-default"
                  to={buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_EDIT.PATH, {
                    id: data.agreement.id,
                  })}
                >
                  Vedi accordo
                </Link>
              </span>
            </DescriptionBlock>

            <DescriptionBlock label="Stato dell'accordo">
              <span>{AGREEMENT_STATUS_LABEL[data.agreement.status]}</span>
            </DescriptionBlock>

            <DescriptionBlock label="Finalità">
              <span>{data.purposes}</span>
            </DescriptionBlock>
          </div>

          {actions.length > 0 && (
            <div className="mt-5 d-flex">
              {actions.map(({ onClick, label, isMock }, i) => (
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
          )}
        </WhiteBackground>
      )}

      <UserList />
    </React.Fragment>
  )
}

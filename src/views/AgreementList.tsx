import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AGREEMENT_STATUS_LABEL, ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import {
  AgreementStatus,
  AgreementSummary,
  ActionWithTooltipBtn,
  ActionWithTooltipLink,
  ActionWithTooltipProps,
  ProviderOrSubscriber,
} from '../../types'
import { TableWithLoader } from '../components/TableWithLoader'
import { ActionWithTooltip } from '../components/ActionWithTooltip'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useMode } from '../hooks/useMode'
import { TempFilters } from '../components/TempFilters'
import { mergeActions } from '../lib/eservice-utils'
import { getAgreementStatus } from '../lib/status-utils'
import { useFeedback } from '../hooks/useFeedback'
import { Layout } from '../components/Shared/Layout'

export function AgreementList() {
  const { runAction, forceRerenderCounter, wrapActionInDialog } = useFeedback()
  const mode = useMode()
  const { party } = useContext(PartyContext)

  const params =
    mode === 'provider' ? { producerId: party?.partyId } : { consumerId: party?.partyId }
  const { data, loadingText, error } = useAsyncFetch<AgreementSummary[]>(
    {
      path: { endpoint: 'AGREEMENT_GET_LIST' },
      config: { params },
    },
    {
      defaultValue: [],
      useEffectDeps: [forceRerenderCounter],
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando gli accordi',
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapActivate = (agreementId: string) => async () => {
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

  const wrapSuspend = (agreementId: string) => async () => {
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

  const wrapUpgrade = (agreementId: string) => async () => {
    await runAction(
      {
        path: { endpoint: 'AGREEMENT_UPGRADE', endpointParams: { agreementId } },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  type AgreementActions = { [key in AgreementStatus]: ActionWithTooltipProps[] }
  // Build list of available actions for each service in its current state
  const getAvailableActions = (agreement: AgreementSummary) => {
    const sharedActions: AgreementActions = {
      active: [
        {
          onClick: wrapActionInDialog(wrapSuspend(agreement.id), 'AGREEMENT_SUSPEND'),
          label: 'Sospendi',
          icon: 'bi-pause-circle',
        },
      ],
      suspended: [
        {
          onClick: wrapActionInDialog(wrapActivate(agreement.id), 'AGREEMENT_ACTIVATE'),
          label: 'Riattiva',
          icon: 'bi-play-circle',
        },
      ],
      pending: [],
      inactive: [],
    }

    const subscriberOnlyActionsActive: ActionWithTooltipProps[] = []
    if (agreement.eservice.activeDescriptor) {
      subscriberOnlyActionsActive.push({
        onClick: wrapActionInDialog(wrapUpgrade(agreement.id), 'AGREEMENT_UPGRADE'),
        label: 'Aggiorna',
        icon: 'bi-arrow-up-square',
      })
    }

    const subscriberOnlyActions: AgreementActions = {
      active: subscriberOnlyActionsActive,
      suspended: [],
      pending: [],
      inactive: [],
    }

    const providerOnlyActions: AgreementActions = {
      active: [],
      suspended: [],
      pending: [
        {
          onClick: wrapActionInDialog(wrapActivate(agreement.id), 'AGREEMENT_ACTIVATE'),
          label: 'Attiva',
          icon: 'bi-toggle2-on',
        },
      ],
      inactive: [],
    }

    const currentActions: AgreementActions = {
      provider: providerOnlyActions,
      subscriber: subscriberOnlyActions,
    }[mode!]

    const status = getAgreementStatus(agreement, mode)

    const mergedActions = mergeActions<AgreementActions>([currentActions, sharedActions], status)

    const inspectAction = {
      to: `${
        ROUTES[mode === 'provider' ? 'PROVIDE' : 'SUBSCRIBE'].SUBROUTES!.AGREEMENT_LIST.PATH
      }/${agreement.id}`,
      icon: 'bi-info-circle',
      label: 'Ispeziona',
    }

    // Add the last action, which is always EDIT/INSPECT
    mergedActions.push(inspectAction)

    return mergedActions
  }

  const headData = [
    'nome e-service',
    'versione e-service',
    'stato accordo',
    mode === 'provider' ? 'ente fruitore' : 'ente erogatore',
    '',
  ]

  const INTRO: { [key in ProviderOrSubscriber]: { title: string; description?: string } } = {
    provider: {
      title: 'Gli accordi',
      description: "In quest'area puoi gestire tutti gli accordi di cui sei erogatore",
    },
    subscriber: {
      title: 'Gli accordi',
      description: "In quest'area puoi gestire tutti gli accordi di cui sei fruitore",
    },
  }

  return (
    <Layout>
      <StyledIntro priority={2}>{INTRO[mode!]}</StyledIntro>

      <div className="mt-4">
        <TempFilters />

        <TableWithLoader
          loadingText={loadingText}
          headData={headData}
          pagination={true}
          data={data}
          noDataLabel="Non ci sono accordi disponibili"
          error={error}
        >
          {data.map((item, i) => (
            <tr key={i}>
              <td>{item.eservice.name}</td>
              <td>{item.eservice.version}</td>
              <td>{AGREEMENT_STATUS_LABEL[item.status]}</td>
              <td>{mode === 'provider' ? item.consumer.name : item.producer.name}</td>
              <td>
                {getAvailableActions(item).map((tableAction, j) => {
                  const btnProps: any = {}

                  if ((tableAction as ActionWithTooltipLink).to) {
                    btnProps.as = Link
                    btnProps.to = (tableAction as ActionWithTooltipLink).to
                  } else {
                    btnProps.onClick = (tableAction as ActionWithTooltipBtn).onClick
                  }

                  return (
                    <ActionWithTooltip
                      key={j}
                      btnProps={btnProps}
                      label={tableAction.label}
                      iconClass={tableAction.icon!}
                      isMock={tableAction.isMock}
                    />
                  )
                })}
              </td>
            </tr>
          ))}
        </TableWithLoader>
      </div>
    </Layout>
  )
}

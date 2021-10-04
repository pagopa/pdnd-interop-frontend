import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'
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
import { StyledIntro } from '../components/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useMode } from '../hooks/useMode'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { TempFilters } from '../components/TempFilters'
import { withAdminAuth } from '../components/withAdminAuth'
import compose from 'lodash/fp/compose'
import { withToastOnMount } from '../components/withToastOnMount'

function AgreementListComponent({
  runAction,
  runFakeAction,
  forceRerenderCounter,
  wrapActionInDialog,
}: UserFeedbackHOCProps) {
  const mode = useMode()
  const { party } = useContext(PartyContext)

  const params =
    mode === 'provider' ? { producerId: party?.partyId } : { consumerId: party?.partyId }
  const { data, loading, error } = useAsyncFetch<AgreementSummary[]>(
    {
      path: { endpoint: 'AGREEMENT_GET_LIST' },
      config: { method: 'GET', params },
    },
    { defaultValue: [], useEffectDeps: [forceRerenderCounter] }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapSuspend = (agreementId: string) => async (_: any) => {
    await runAction(
      {
        path: { endpoint: 'AGREEMENT_SUSPEND', endpointParams: { agreementId } },
        config: { method: 'PATCH' },
      },
      { suppressToast: false }
    )
  }

  const wrapReactivate = (agreementId: string) => async (_: any) => {
    runFakeAction('Riattiva accordo: ' + agreementId)
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (agreement: AgreementSummary) => {
    const availableActions: { [key in AgreementStatus]: ActionWithTooltipProps[] } = {
      active: [
        {
          onClick: wrapActionInDialog(wrapSuspend(agreement.id), 'AGREEMENT_SUSPEND'),
          label: 'sospendi',
          icon: 'bi-pause-circle',
        },
      ],
      suspended: [
        {
          onClick: wrapActionInDialog(wrapReactivate(agreement.id), 'AGREEMENT_ACTIVATE'),
          label: 'riattiva',
          icon: 'bi-play-circle',
        },
      ],
      pending: [],
    }

    const status = agreement.status

    const inspectAction = {
      to: `${
        ROUTES[mode === 'provider' ? 'PROVIDE' : 'SUBSCRIBE'].SUBROUTES!.AGREEMENT_LIST.PATH
      }/${agreement.id}`,
      icon: 'bi-info-circle',
      label: 'Ispeziona',
    }

    // Get all the actions available for this particular status
    const actions: ActionWithTooltipProps[] = (availableActions as any)[status] || []

    // Add the last action, which is always EDIT/INSPECT
    actions.push(inspectAction)

    return actions
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
    <WhiteBackground>
      <StyledIntro priority={2}>{INTRO[mode!]}</StyledIntro>

      <div className="mt-4">
        <TempFilters />

        <TableWithLoader
          loading={loading}
          loadingLabel="Stiamo caricando gli accordi"
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
    </WhiteBackground>
  )
}

export const AgreementList = compose(
  withUserFeedback,
  withAdminAuth,
  withToastOnMount
)(AgreementListComponent)

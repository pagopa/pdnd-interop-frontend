import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'
import { AGREEMENT_STATUS_LABEL, ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import {
  AgreementStatus,
  AgreementSummary,
  TableActionBtn,
  TableActionLink,
  TableActionProps,
} from '../../types'
import { TableWithLoader } from '../components/TableWithLoader'
import { TableAction } from '../components/TableAction'
import { StyledIntro } from '../components/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useMode } from '../hooks/useMode'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { TempFilters } from '../components/TempFilters'
import { withAdminAuth } from '../components/withAdminAuth'
import compose from 'lodash/fp/compose'

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
    await runAction({
      path: { endpoint: 'AGREEMENT_SUSPEND', endpointParams: { agreementId } },
      config: { method: 'PATCH' },
    })
  }

  const wrapReactivate = (agreementId: string) => async (_: any) => {
    runFakeAction('Riattiva accordo: ' + agreementId)
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (agreement: AgreementSummary) => {
    const availableActions: { [key in AgreementStatus]: TableActionProps[] } = {
      active: [
        {
          onClick: wrapActionInDialog(wrapSuspend(agreement.id), 'AGREEMENT_SUSPEND'),
          label: 'sospendi',
          icon: 'bi-pause-circle',
        },
      ],
      suspended: [
        {
          onClick: wrapActionInDialog(wrapReactivate(agreement.id)),
          label: 'riattiva',
          icon: 'bi-play-circle',
          isMock: true,
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
    const actions: TableActionProps[] = (availableActions as any)[status] || []

    // Add the last action, which is always EDIT/INSPECT
    actions.push(inspectAction)

    return actions
  }

  const headData = [
    'nome servizio',
    'versione servizio',
    'stato accordo',
    mode === 'provider' ? 'ente fruitore' : 'ente erogatore',
    '',
  ]

  return (
    <WhiteBackground>
      <StyledIntro priority={2}>
        {{
          title: 'Gli accordi',
          description:
            "In quest'area puoi gestire tutti gli accordi stretti dai fruitori per i tuoi e-service",
        }}
      </StyledIntro>

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
              <td>{item.eserviceName || item.eserviceId}</td>
              <td>{item.eserviceVersion || 1}</td>
              <td>{AGREEMENT_STATUS_LABEL[item.status]}</td>
              <td>
                {mode === 'provider'
                  ? item.consumerName || item.consumerId
                  : item.producerName || item.producerId}
              </td>
              <td>
                {getAvailableActions(item).map((tableAction, j) => {
                  const btnProps: any = {}

                  if ((tableAction as TableActionLink).to) {
                    btnProps.as = Link
                    btnProps.to = (tableAction as TableActionLink).to
                  } else {
                    btnProps.onClick = (tableAction as TableActionBtn).onClick
                  }

                  return (
                    <TableAction
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

export const AgreementList = compose(withUserFeedback, withAdminAuth)(AgreementListComponent)

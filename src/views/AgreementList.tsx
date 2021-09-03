import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'
import { AGREEMENT_STATUS, ROUTES } from '../lib/constants'
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

function AgreementListComponent({
  runAction,
  runFakeAction,
  forceUpdateCounter,
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
    { defaultValue: [], useEffectDeps: [forceUpdateCounter] }
  )

  const getAvailableActions = (agreement: any) => {
    const availableActions: { [key in AgreementStatus]: TableActionProps[] } = {
      active: [],
      suspended: [],
      pending: [],
    }

    const status = agreement.status

    // If status === 'draft', show precompiled write template. Else, readonly template
    const inspectAction = {
      to: `${
        ROUTES[mode === 'provider' ? 'PROVIDE' : 'SUBSCRIBE'].SUBROUTES!.AGREEMENT_LIST.PATH
      }/${agreement.id}`,
      icon: status === 'draft' ? 'bi-pencil' : 'bi-info-circle',
      label: status === 'draft' ? 'Modifica' : 'Ispeziona',
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
      <StyledIntro>
        {{
          title: 'Gli accordi',
          description:
            "In quest'area puoi gestire tutti gli accordi stretti dai fruitori per i tuoi e-service",
        }}
      </StyledIntro>

      <div className="mt-4">
        <h1 className="py-3" style={{ color: 'red' }}>
          Aggiungere filtri
        </h1>

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
              <td>{AGREEMENT_STATUS[item.status]}</td>
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
                      iconClass={tableAction.icon}
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

export const AgreementList = withUserFeedback(AgreementListComponent)

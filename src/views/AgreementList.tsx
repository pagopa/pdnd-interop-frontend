import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'
import { AGREEMENT_STATUS, ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { AgreementStatus, AgreementSummary } from '../../types'
import { TableWithLoader } from '../components/TableWithLoader'
import { TableAction } from '../components/TableAction'
import { StyledIntro } from '../components/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'

type Action = {
  to?: string
  onClick?: any
  icon: string
  label: string
}

export function AgreementList() {
  const { party } = useContext(PartyContext)
  const { data: agreement, isLoading } = useAsyncFetch<AgreementSummary>({
    path: { endpoint: 'AGREEMENT_GET_LIST' },
    config: {
      method: 'GET',
      params: { producerId: party?.partyId },
    },
  })

  const getAvailableActions = (agreement: any) => {
    const availableActions: { [key in AgreementStatus]: any } = { active: [] }

    const status = agreement.status

    // If status === 'draft', show precompiled write template. Else, readonly template
    const inspectAction = {
      to: `${ROUTES.PROVIDE.SUBROUTES!.AGREEMENT_LIST.PATH}/${agreement.id}`,
      icon: status === 'draft' ? 'bi-pencil' : 'bi-info-circle',
      label: status === 'draft' ? 'Modifica' : 'Ispeziona',
    }

    // Get all the actions available for this particular status
    const actions: Action[] = (availableActions as any)[status] || []

    // Add the last action, which is always EDIT/INSPECT
    actions.push(inspectAction)

    return actions
  }

  const headData = ['nome servizio', 'versione servizio', 'stato accordo', 'ente fruitore', '']

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
          isLoading={isLoading}
          loadingLabel="Stiamo caricando gli accordi"
          headData={headData}
          pagination={true}
        >
          {agreement.length === 0 ? (
            <tr>
              <td colSpan={headData.length}>Non ci sono accordi disponibili</td>
            </tr>
          ) : (
            agreement.map((item, i) => (
              <tr key={i}>
                <td>{item.serviceName}</td>
                <td>{item.serviceVersion}</td>
                <td>{AGREEMENT_STATUS[item.status]}</td>
                <td>
                  {getAvailableActions(item).map(({ to, onClick, icon, label }, j) => {
                    const btnProps: any = { onClick }

                    if (to) {
                      btnProps.as = Link
                      btnProps.to = to
                      delete btnProps.onClick // Redundant, here just for clarity
                    }

                    return (
                      <TableAction key={j} btnProps={btnProps} label={label} iconClass={icon} />
                    )
                  })}
                </td>
              </tr>
            ))
          )}
        </TableWithLoader>
      </div>
    </WhiteBackground>
  )
}

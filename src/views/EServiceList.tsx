import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'
import { ESERVICE_STATUS, ROUTES } from '../lib/constants'
import { Button } from 'react-bootstrap'
import { PartyContext } from '../lib/context'
import { EServiceStatus, EServiceSummary, TableActionBtn, ToastContent } from '../../types'
import { TableWithLoader } from '../components/TableWithLoader'
import { TableAction } from '../components/TableAction'
import { StyledIntro } from '../components/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { showTempAlert } from '../lib/wip-utils'
import { fetchWithLogs } from '../lib/api-utils'
import { getFetchOutcome } from '../lib/error-utils'
import { StyledToast } from '../components/StyledToast'

export function EServiceList() {
  const [toast, setToast] = useState<ToastContent>()
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0)
  const { party } = useContext(PartyContext)
  const { data, loading, error } = useAsyncFetch<EServiceSummary[]>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST' },
      config: { method: 'GET', params: { producerId: party?.partyId } },
    },
    [],
    undefined,
    [forceUpdateCounter]
  )

  const closeToast = () => {
    setToast(undefined)
  }

  const buildPublishDraft = (eserviceId: string, descriptorId: string) => async (_: any) => {
    const publishResponse = await fetchWithLogs(
      { endpoint: 'ESERVICE_VERSION_PUBLISH', endpointParams: { eserviceId, descriptorId } },
      { method: 'POST' }
    )

    const outcome = getFetchOutcome(publishResponse)

    let title = ''
    let description = ''
    if (outcome === 'success') {
      setForceUpdateCounter(forceUpdateCounter + 1)
      title = 'Nuova versione'
      description = 'La nuova versione del servizio è stata pubblicata correttamente'
    } else if (outcome === 'error') {
      title = 'Errore'
      description =
        'Si è verificato un errore, non è stato possibile pubblicare la nuova versione del servizio'
    }

    setToast({ title, description, onClose: closeToast })
  }

  const buildDeleteDraft = (eserviceId: string, descriptorId: string) => async (_: any) => {
    const deleteResponse = await fetchWithLogs(
      { endpoint: 'ESERVICE_DRAFT_DELETE', endpointParams: { eserviceId, descriptorId } },
      { method: 'DELETE' }
    )

    const outcome = getFetchOutcome(deleteResponse)

    let title = ''
    let description = ''
    if (outcome === 'success') {
      setForceUpdateCounter(forceUpdateCounter + 1)
      title = 'Bozza cancellata correttamente'
      description = 'La bozza è stata cancellata correttamente'
    } else if (outcome === 'error') {
      title = 'Errore'
      description = 'Si è verificato un errore, non è stato possibile cancellare la bozza'
    }

    setToast({ title, description, onClose: closeToast })
  }

  const reactivate = () => {
    showTempAlert('Riattiva servizio')
  }

  const suspend = () => {
    showTempAlert('Sospendi servizio')
  }

  const archive = () => {
    // Can only archive if all agreements on that version are archived
    // Check with backend if this can be automated
    showTempAlert('Archivia servizio')
  }

  const getAvailableActions = (service: EServiceSummary) => {
    const availableActions: { [key in EServiceStatus]: TableActionBtn[] } = {
      published: [
        {
          onClick: suspend,
          icon: 'bi-pause-circle',
          label: 'Sospendi',
          isMock: true,
        },
      ],
      archived: [],
      deprecated: [
        {
          onClick: suspend,
          icon: 'bi-pause-circle',
          label: 'Sospendi',
          isMock: true,
        },
        {
          onClick: archive,
          icon: 'bi-archive',
          label: 'Archivia',
          isMock: true,
        },
      ],
      draft: [
        {
          onClick: buildPublishDraft(service.id, service.descriptors[0].id),
          icon: 'bi-box-arrow-up',
          label: 'Pubblica',
        },
        {
          onClick: buildDeleteDraft(service.id, service.descriptors[0].id),
          icon: 'bi-trash',
          label: 'Elimina',
        },
      ],
      suspended: [
        {
          onClick: reactivate,
          icon: 'bi-play-circle',
          label: 'Riattiva',
          isMock: true,
        },
      ],
    }

    const status = service.descriptors[0].status

    // If status === 'draft', show precompiled write template. Else, readonly template
    const inspectAction = {
      to: `${ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH}/${service.id}`,
      icon: status === 'draft' ? 'bi-pencil' : 'bi-info-circle',
      label: status === 'draft' ? 'Modifica' : 'Ispeziona',
    }

    // Get all the actions available for this particular status
    const actions: TableActionBtn[] = availableActions[status]

    // Add the last action, which is always EDIT/INSPECT
    actions.push(inspectAction)

    return actions
  }

  const headData = ['nome servizio', 'versione attuale', 'stato del servizio', '']

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro>
          {{
            title: 'I tuoi e-service',
            description: "In quest'area puoi gestire tutti gli e-service che stai erogando",
          }}
        </StyledIntro>

        <div className="mt-4">
          <Button variant="primary" as={Link} to={ROUTES.PROVIDE.SUBROUTES!.ESERVICE_CREATE.PATH}>
            {ROUTES.PROVIDE.SUBROUTES!.ESERVICE_CREATE.LABEL}
          </Button>

          <h1 className="py-3" style={{ color: 'red' }}>
            Aggiungere filtri
          </h1>

          <TableWithLoader
            loading={loading}
            loadingLabel="Stiamo caricando i tuoi e-service"
            headData={headData}
            pagination={true}
            data={data}
            noDataLabel="Non ci sono servizi disponibili"
            error={error}
          >
            {data.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.descriptors[0].version}</td>
                <td>{ESERVICE_STATUS[item.descriptors[0].status]}</td>
                <td>
                  {getAvailableActions(item).map(({ to, onClick, icon, label, isMock }, j) => {
                    const btnProps: any = { onClick }

                    if (to) {
                      btnProps.as = Link
                      btnProps.to = to
                      delete btnProps.onClick // Redundant, here just for clarity
                    }

                    return (
                      <TableAction
                        key={j}
                        btnProps={btnProps}
                        label={label}
                        iconClass={icon}
                        isMock={isMock}
                      />
                    )
                  })}
                </td>
              </tr>
            ))}
          </TableWithLoader>
        </div>
      </WhiteBackground>

      {toast && <StyledToast {...toast} />}
    </React.Fragment>
  )
}

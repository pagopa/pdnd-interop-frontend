import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'
import { ESERVICE_STATUS, ROUTES, TOAST_CONTENTS } from '../lib/constants'
import { Button } from 'react-bootstrap'
import { PartyContext } from '../lib/context'
import {
  ActionFunction,
  DialogContent,
  EServiceStatus,
  EServiceSummary,
  RequestConfig,
  RunActionProps,
  TableActionBtn,
  TableActionLink,
  TableActionProps,
  ToastContent,
  ToastProps,
} from '../../types'
import { TableWithLoader } from '../components/TableWithLoader'
import { TableAction } from '../components/TableAction'
import { StyledIntro } from '../components/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { showTempAlert } from '../lib/wip-utils'
import { fetchWithLogs } from '../lib/api-utils'
import { getFetchOutcome } from '../lib/error-utils'
import { StyledToast } from '../components/StyledToast'
import { StyledDialog } from '../components/StyledDialog'
import { LoadingOverlay } from '../components/LoadingOverlay'

export function EServiceList() {
  const [actionLoadingText, setActionLoadingText] = useState<string | undefined>(undefined)
  const [dialog, setDialog] = useState<DialogContent>()
  const [toast, setToast] = useState<ToastProps>()
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0)

  const { party } = useContext(PartyContext)
  const {
    data,
    loading: dataLoading,
    error,
  } = useAsyncFetch<EServiceSummary[]>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST' },
      config: { method: 'GET', params: { producerId: party?.partyId } },
    },
    { defaultValue: [], useEffectDeps: [forceUpdateCounter] }
  )

  // Dialog and toast related functions
  const wrapActionInDialog = (wrappedAction: ActionFunction) => async (_: any) => {
    setDialog({ proceedCallback: wrappedAction, close: closeDialog })
  }
  const closeToast = () => {
    setToast(undefined)
  }
  const closeDialog = () => {
    setDialog(undefined)
  }
  const showToast = ({
    title = 'Operazione conclusa',
    description = 'Operazione conclusa con successo',
  }: ToastContent) => {
    setToast({ title, description, onClose: closeToast })
  }

  /*
   * API calls
   */
  const runAction = async (request: RequestConfig) => {
    const { loadingText, success, error }: RunActionProps = TOAST_CONTENTS[request.path.endpoint]

    closeDialog()
    setActionLoadingText(loadingText)

    const response = await fetchWithLogs(request.path, request.config)
    const outcome = getFetchOutcome(response)

    let toastContent: ToastContent = error
    if (outcome === 'success') {
      setForceUpdateCounter(forceUpdateCounter + 1)
      toastContent = success
    }

    setActionLoadingText(undefined)
    showToast(toastContent)
  }

  const runFakeAction = (actionName: string) => {
    closeDialog()
    showTempAlert(actionName)
    showToast({ title: actionName, description: "L'operazione è andata a buon fine" })
  }
  /*
   * End API calls
   */

  /*
   * List of possible actions for the user to perform
   */
  const wrapPublishDraft = (eserviceId: string, descriptorId: string) => async (_: any) => {
    await runAction({
      path: { endpoint: 'ESERVICE_VERSION_PUBLISH', endpointParams: { eserviceId, descriptorId } },
      config: { method: 'POST' },
    })
  }

  const wrapDeleteDraft = (eserviceId: string, descriptorId: string) => async (_: any) => {
    await runAction({
      path: { endpoint: 'ESERVICE_DRAFT_DELETE', endpointParams: { eserviceId, descriptorId } },
      config: { method: 'DELETE' },
    })
  }

  const reactivate = () => {
    runFakeAction('Riattiva servizio')
  }

  const suspend = () => {
    runFakeAction('Sospendi servizio')
  }

  const archive = () => {
    // Can only archive if all agreements on that version are archived
    // Check with backend if this can be automated
    runFakeAction('Archivia servizio')
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (service: EServiceSummary) => {
    const availableActions: { [key in EServiceStatus]: TableActionProps[] } = {
      published: [
        {
          onClick: wrapActionInDialog(suspend),
          icon: 'bi-pause-circle',
          label: 'Sospendi',
          isMock: true,
        },
      ],
      archived: [],
      deprecated: [
        {
          onClick: wrapActionInDialog(suspend),
          icon: 'bi-pause-circle',
          label: 'Sospendi',
          isMock: true,
        },
        {
          onClick: wrapActionInDialog(archive),
          icon: 'bi-archive',
          label: 'Archivia',
          isMock: true,
        },
      ],
      draft: [
        {
          onClick: wrapActionInDialog(wrapPublishDraft(service.id, service.descriptors[0].id)),
          icon: 'bi-box-arrow-up',
          label: 'Pubblica',
        },
        {
          onClick: wrapActionInDialog(wrapDeleteDraft(service.id, service.descriptors[0].id)),
          icon: 'bi-trash',
          label: 'Elimina',
        },
      ],
      suspended: [
        {
          onClick: wrapActionInDialog(reactivate),
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
    const actions: TableActionProps[] = availableActions[status]

    // Add the last action, which is always EDIT/INSPECT
    actions.push(inspectAction)

    return actions
  }

  // Data for the table head
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
            loading={dataLoading}
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

      {dialog && <StyledDialog {...dialog} />}
      {toast && <StyledToast {...toast} />}
      {(dataLoading || actionLoadingText) && (
        <LoadingOverlay
          loadingText={actionLoadingText || "Stiamo effettuando l'operazione richiesta"}
        />
      )}
    </React.Fragment>
  )
}

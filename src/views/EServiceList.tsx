import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'
import { ESERVICE_STATUS_LABEL, ROUTES } from '../lib/constants'
import { Button } from 'react-bootstrap'
import { PartyContext } from '../lib/context'
import compose from 'lodash/fp/compose'
import {
  EServiceReadType,
  EServiceStatus,
  TableActionBtn,
  TableActionLink,
  TableActionProps,
} from '../../types'
import { TableWithLoader } from '../components/TableWithLoader'
import { TableAction } from '../components/TableAction'
import { StyledIntro } from '../components/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { withToastOnMount } from '../components/withToastOnMount'

function EServiceListComponent({
  runAction,
  runFakeAction,
  forceRerenderCounter,
  wrapActionInDialog,
}: UserFeedbackHOCProps) {
  const { party } = useContext(PartyContext)
  const { data, loading, error } = useAsyncFetch<EServiceReadType[]>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST' },
      config: { method: 'GET', params: { producerId: party?.partyId } },
    },
    { defaultValue: [], useEffectDeps: [forceRerenderCounter] }
  )

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

  // Clones the properties and generates a new service
  const clone = () => {
    runFakeAction('Crea nuovo servizio (clonato)')
  }

  // Clones all the properties of the previous version and generates a new draft version
  const createDraftFromVersion = () => {
    runFakeAction('Crea nuova versione (clonata)')
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (service: EServiceReadType) => {
    const availableActions: { [key in EServiceStatus]: TableActionProps[] } = {
      published: [
        {
          onClick: wrapActionInDialog(suspend),
          icon: 'bi-pause-circle',
          label: 'Sospendi',
          isMock: true,
        },
        {
          onClick: wrapActionInDialog(clone),
          icon: 'bi-files',
          label: 'Clona',
          isMock: true,
        },
        {
          onClick: wrapActionInDialog(createDraftFromVersion),
          icon: 'bi-clipboard-plus',
          label: 'Crea bozza precompilata',
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
          onClick: wrapActionInDialog(
            wrapPublishDraft(service.id, service.descriptors[0].id),
            'ESERVICE_VERSION_PUBLISH'
          ),
          icon: 'bi-box-arrow-up',
          label: 'Pubblica',
        },
        {
          onClick: wrapActionInDialog(
            wrapDeleteDraft(service.id, service.descriptors[0].id),
            'ESERVICE_DRAFT_DELETE'
          ),
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
                <td>{ESERVICE_STATUS_LABEL[item.descriptors[0].status]}</td>
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
    </React.Fragment>
  )
}

export const EServiceList = compose(withUserFeedback, withToastOnMount)(EServiceListComponent)

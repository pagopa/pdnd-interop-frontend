import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'
import { ESERVICE_STATUS_LABEL, ROUTES } from '../lib/constants'
import { Button } from 'react-bootstrap'
import { PartyContext } from '../lib/context'
import compose from 'lodash/fp/compose'
import {
  ApiEndpointKey,
  EServiceDescriptorRead,
  EServiceFlatReadType,
  EServiceStatus,
  ActionWithTooltipBtn,
  ActionWithTooltipLink,
  ActionWithTooltipProps,
} from '../../types'
import { TableWithLoader } from '../components/TableWithLoader'
import { ActionWithTooltip } from '../components/ActionWithTooltip'
import { StyledIntro } from '../components/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { withToastOnMount } from '../components/withToastOnMount'
import { TempFilters } from '../components/TempFilters'
import { AxiosResponse } from 'axios'

function EServiceListComponent({
  runAction,
  runFakeAction,
  forceRerenderCounter,
  wrapActionInDialog,
}: UserFeedbackHOCProps) {
  const history = useHistory()
  const { party } = useContext(PartyContext)
  const { data, loading, error } = useAsyncFetch<EServiceFlatReadType[]>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: { method: 'GET', params: { producerId: party?.partyId } },
    },
    { defaultValue: [], useEffectDeps: [forceRerenderCounter] }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapPublishDraft = (eserviceId: string, descriptorId: string) => async (_: any) => {
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_PUBLISH',
          endpointParams: { eserviceId, descriptorId },
        },
        config: { method: 'POST' },
      },
      { suppressToast: false }
    )
  }

  const wrapDeleteDraft = (eserviceId: string, descriptorId?: string) => async (_: any) => {
    let endpoint: ApiEndpointKey = 'ESERVICE_DELETE'
    let endpointParams: any = { eserviceId }

    if (descriptorId) {
      endpoint = 'ESERVICE_VERSION_DELETE'
      endpointParams.descriptorId = descriptorId
    }

    await runAction(
      { path: { endpoint, endpointParams }, config: { method: 'DELETE' } },
      { suppressToast: false }
    )
  }

  const reactivate = () => {
    runFakeAction('Riattiva e-service')
  }

  const suspend = () => {
    runFakeAction('Sospendi e-service')
  }

  const archive = () => {
    // Can only archive if all agreements on that version are archived
    // Check with backend if this can be automated
    runFakeAction('Archivia e-service')
  }

  // Clones the properties and generates a new service
  const clone = () => {
    runFakeAction('Crea nuovo e-service (clonato)')
  }

  // Clones all the properties of the previous version and generates a new draft version
  const wrapCreateNewVersionDraft = (eserviceId: string) => async () => {
    const { outcome, response } = await runAction(
      {
        path: { endpoint: 'ESERVICE_VERSION_CREATE', endpointParams: { eserviceId } },
        config: { method: 'POST', data: { voucherLifespan: 0, audience: [], description: '' } },
      },
      { suppressToast: true }
    )

    if (outcome === 'success') {
      const successResponse = response as AxiosResponse<EServiceDescriptorRead>
      const descriptorId = successResponse.data.id
      history.push(
        `${ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH}/${eserviceId}/${descriptorId}`,
        { stepIndexDestination: 1 }
      )
    }
  }
  /*
   * End list of actions
   */

  type EServiceAction = { [key in EServiceStatus]: Array<ActionWithTooltipProps | null> }
  // Build list of available actions for each service in its current state
  const getAvailableActions = (service: EServiceFlatReadType) => {
    const { id: eserviceId, descriptorId, status } = service
    const availableActions: EServiceAction = {
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
          onClick: wrapActionInDialog(wrapCreateNewVersionDraft(eserviceId)),
          icon: 'bi-clipboard-plus',
          label: 'Crea bozza nuova versione',
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
        descriptorId
          ? {
              onClick: wrapActionInDialog(
                wrapPublishDraft(eserviceId, descriptorId),
                'ESERVICE_VERSION_PUBLISH'
              ),
              icon: 'bi-box-arrow-up',
              label: 'Pubblica',
            }
          : null,
        {
          onClick: wrapActionInDialog(
            wrapDeleteDraft(eserviceId, descriptorId),
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

    // If status === 'draft', show precompiled write template. Else, readonly template
    const inspectAction = {
      to: `${ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH}/${eserviceId}/${
        descriptorId || 'prima-bozza'
      }`,
      icon: !status || status === 'draft' ? 'bi-pencil' : 'bi-info-circle',
      label: !status || status === 'draft' ? 'Modifica' : 'Ispeziona',
    }

    // Get all the actions available for this particular status
    const actions = availableActions[status || 'draft'].filter(
      (a) => a !== null
    ) as ActionWithTooltipProps[]

    // Add the last action, which is always EDIT/INSPECT
    actions.push(inspectAction)

    return actions
  }

  // Data for the table head
  const headData = ['nome e-service', 'versione', 'stato e-service', '']

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro priority={2}>
          {{
            title: 'I tuoi e-service',
            description: "In quest'area puoi gestire tutti gli e-service che stai erogando",
          }}
        </StyledIntro>

        <div className="mt-4">
          <Button variant="primary" as={Link} to={ROUTES.PROVIDE.SUBROUTES!.ESERVICE_CREATE.PATH}>
            {ROUTES.PROVIDE.SUBROUTES!.ESERVICE_CREATE.LABEL}
          </Button>

          <TempFilters />

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
                <td>{item.version || '1'}</td>
                <td>{ESERVICE_STATUS_LABEL[item.status || 'draft']}</td>
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
    </React.Fragment>
  )
}

export const EServiceList = compose(withUserFeedback, withToastOnMount)(EServiceListComponent)

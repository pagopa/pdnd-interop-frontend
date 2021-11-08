import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import { ESERVICE_STATUS_LABEL, ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import {
  ApiEndpointKey,
  EServiceDescriptorRead,
  EServiceFlatReadType,
  EServiceStatus,
  ActionProps,
} from '../../types'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useFeedback } from '../hooks/useFeedback'
import { TempFilters } from '../components/TempFilters'
import { AxiosResponse } from 'axios'
import { buildDynamicPath } from '../lib/url-utils'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledLink } from '../components/Shared/StyledLink'
import { Box } from '@mui/system'
import { StyledTableRow } from '../components/Shared/StyledTableRow'

export function EServiceList() {
  const { runAction, runFakeAction, forceRerenderCounter, wrapActionInDialog } = useFeedback()
  const history = useHistory()
  const { party } = useContext(PartyContext)
  const { data, loadingText, error } = useAsyncFetch<EServiceFlatReadType[]>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: {
        params: { producerId: party?.partyId, callerId: party?.partyId },
      },
    },
    {
      defaultValue: [],
      useEffectDeps: [forceRerenderCounter],
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando i tuoi e-service',
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapPublishDraft = (eserviceId: string, descriptorId?: string) => async (_: any) => {
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_PUBLISH',
          endpointParams: { eserviceId, descriptorId },
        },
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

    await runAction({ path: { endpoint, endpointParams } }, { suppressToast: false })
  }

  const wrapSuspend = (eserviceId: string, descriptorId?: string) => async (_: any) => {
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_SUSPEND',
          endpointParams: { eserviceId, descriptorId },
        },
      },
      { suppressToast: false }
    )
  }

  const wrapReactivate = (eserviceId: string, descriptorId?: string) => async (_: any) => {
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_REACTIVATE',
          endpointParams: { eserviceId, descriptorId },
        },
      },
      { suppressToast: false }
    )
  }

  const archive = () => {
    // Can only archive if all agreements on that version are archived
    // Check with backend if this can be automated
    runFakeAction('Archivia e-service')
  }

  // Clones the properties and generates a new service
  const wrapClone = (eserviceId: string, descriptorId?: string) => async (_: any) => {
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_CLONE_FROM_VERSION',
          endpointParams: { eserviceId, descriptorId },
        },
      },
      { suppressToast: false }
    )
  }

  // Clones all the properties of the previous version and generates a new draft version
  const wrapCreateNewVersionDraft = (eserviceId: string) => async () => {
    const { outcome, response } = await runAction(
      {
        path: { endpoint: 'ESERVICE_VERSION_CREATE', endpointParams: { eserviceId } },
        config: { data: { voucherLifespan: 0, audience: [], description: '' } },
      },
      { suppressToast: true }
    )

    if (outcome === 'success') {
      const successResponse = response as AxiosResponse<EServiceDescriptorRead>
      const descriptorId = successResponse.data.id
      history.push(
        buildDynamicPath(ROUTES.PROVIDE.SUBROUTES!.ESERVICE_EDIT.PATH, {
          eserviceId,
          descriptorId,
        }),
        { stepIndexDestination: 1 }
      )
    }
  }
  /*
   * End list of actions
   */

  type EServiceAction = { [key in EServiceStatus]: Array<ActionProps | null> }
  // Build list of available actions for each service in its current state
  const getAvailableActions = (service: EServiceFlatReadType) => {
    const { id: eserviceId, descriptorId, status } = service

    const suspendAction = {
      onClick: wrapActionInDialog(
        wrapSuspend(eserviceId, descriptorId),
        'ESERVICE_VERSION_SUSPEND'
      ),
      label: 'Sospendi',
    }
    const reactivateAction = {
      onClick: wrapActionInDialog(
        wrapReactivate(eserviceId, descriptorId),
        'ESERVICE_VERSION_REACTIVATE'
      ),
      label: 'Riattiva',
    }
    const cloneAction = {
      onClick: wrapActionInDialog(
        wrapClone(eserviceId, descriptorId),
        'ESERVICE_CLONE_FROM_VERSION'
      ),
      label: 'Clona',
    }
    const createVersionDraftAction = {
      onClick: wrapActionInDialog(wrapCreateNewVersionDraft(eserviceId), 'ESERVICE_VERSION_CREATE'),
      label: 'Crea bozza nuova versione',
    }
    const archiveAction = {
      onClick: wrapActionInDialog(archive),
      label: 'Archivia',
      isMock: true,
    }
    const publishDraftAction = {
      onClick: wrapActionInDialog(
        wrapPublishDraft(eserviceId, descriptorId),
        'ESERVICE_VERSION_PUBLISH'
      ),
      label: 'Pubblica',
    }
    const deleteDraftAction = {
      onClick: wrapActionInDialog(
        wrapDeleteDraft(eserviceId, descriptorId),
        'ESERVICE_VERSION_DELETE'
      ),
      label: 'Elimina',
    }

    const availableActions: EServiceAction = {
      published: [suspendAction, cloneAction, createVersionDraftAction],
      archived: [],
      deprecated: [suspendAction, archiveAction],
      draft: [descriptorId ? publishDraftAction : null, deleteDraftAction],
      suspended: [reactivateAction, cloneAction, createVersionDraftAction],
    }

    // Return all the actions available for this particular status
    return availableActions[status || 'draft'].filter((a) => a !== null) as ActionProps[]
  }

  // Data for the table head
  const headData = ['nome e-service', 'versione', 'stato e-service', '']

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'I tuoi e-service',
          description: "In quest'area puoi gestire tutti gli e-service che stai erogando",
        }}
      </StyledIntro>

      <Box sx={{ mt: 4 }}>
        <StyledButton
          variant="contained"
          component={StyledLink}
          to={ROUTES.PROVIDE.SUBROUTES!.ESERVICE_CREATE.PATH}
        >
          {ROUTES.PROVIDE.SUBROUTES!.ESERVICE_CREATE.LABEL}
        </StyledButton>

        <TempFilters />

        <TableWithLoader
          loadingText={loadingText}
          headData={headData}
          pagination={true}
          data={data}
          noDataLabel="Non ci sono servizi disponibili"
          error={error}
        >
          {data.map((item, i) => (
            <StyledTableRow
              cellData={[
                { label: item.name },
                { label: item.version || '1' },
                { label: ESERVICE_STATUS_LABEL[item.status || 'draft'] },
              ]}
              index={i}
              singleActionBtn={{
                props: {
                  to: buildDynamicPath(ROUTES.PROVIDE.SUBROUTES!.ESERVICE_EDIT.PATH, {
                    eserviceId: item.id,
                    descriptorId: item.descriptorId || 'prima-bozza',
                  }),
                  component: StyledLink,
                },
                label: !item.status || item.status === 'draft' ? 'Modifica' : 'Ispeziona',
              }}
              actions={getAvailableActions(item)}
            />
          ))}
        </TableWithLoader>
      </Box>
    </React.Fragment>
  )
}

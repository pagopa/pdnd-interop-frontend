import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import { LangContext, PartyContext } from '../lib/context'
import {
  ApiEndpointKey,
  EServiceDescriptorRead,
  EServiceFlatReadType,
  EServiceState,
  ActionProps,
} from '../../types'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useFeedback } from '../hooks/useFeedback'
import { TempFilters } from '../components/TempFilters'
import { AxiosResponse } from 'axios'
import { buildDynamicPath } from '../lib/router-utils'
import { StyledButton } from '../components/Shared/StyledButton'
import { Box } from '@mui/system'
import { ESERVICE_STATE_LABEL } from '../config/labels'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { ActionMenu } from '../components/Shared/ActionMenu'
import { axiosErrorToError } from '../lib/error-utils'
import { URL_FRAGMENTS } from '../lib/constants'
import { useRoute } from '../hooks/useRoute'

export function EServiceList() {
  const { runAction, forceRerenderCounter, wrapActionInDialog } = useFeedback()
  const history = useHistory()
  const { party } = useContext(PartyContext)
  const { lang } = useContext(LangContext)
  const { routes } = useRoute()
  const { data, loadingText, error } = useAsyncFetch<Array<EServiceFlatReadType>>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: {
        params: { producerId: party?.id, callerId: party?.id },
      },
    },
    {
      useEffectDeps: [forceRerenderCounter],
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando i tuoi E-Service',
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapPublishDraft = (eserviceId: string, descriptorId?: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DRAFT_PUBLISH',
          endpointParams: { eserviceId, descriptorId },
        },
      },
      { suppressToast: false }
    )
  }

  const wrapDeleteDraft = (eserviceId: string, descriptorId?: string) => async () => {
    let endpoint: ApiEndpointKey = 'ESERVICE_DRAFT_DELETE'
    const endpointParams: Record<string, string> = { eserviceId }

    if (descriptorId) {
      endpoint = 'ESERVICE_VERSION_DRAFT_DELETE'
      endpointParams.descriptorId = descriptorId
    }

    await runAction({ path: { endpoint, endpointParams } }, { suppressToast: false })
  }

  const wrapSuspend = (eserviceId: string, descriptorId?: string) => async () => {
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

  const wrapReactivate = (eserviceId: string, descriptorId?: string) => async () => {
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

  // const archive = () => {
  //   //
  // }

  // Clones the properties and generates a new service
  const wrapClone = (eserviceId: string, descriptorId?: string) => async () => {
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
        path: { endpoint: 'ESERVICE_VERSION_DRAFT_CREATE', endpointParams: { eserviceId } },
        config: {
          data: { voucherLifespan: 1, audience: [], description: '', dailyCallsMaxNumber: 1 },
        },
      },
      { suppressToast: true }
    )

    if (outcome === 'success') {
      const successResponse = response as AxiosResponse<EServiceDescriptorRead>
      const descriptorId = successResponse.data.id
      history.push(
        buildDynamicPath(routes.PROVIDE_ESERVICE_EDIT.PATH, {
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

  type EServiceAction = Record<EServiceState, Array<ActionProps | null>>
  // Build list of available actions for each service in its current state
  const getAvailableActions = (service: EServiceFlatReadType) => {
    const { id: eserviceId, descriptorId, state } = service

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
      onClick: wrapActionInDialog(
        wrapCreateNewVersionDraft(eserviceId),
        'ESERVICE_VERSION_DRAFT_CREATE'
      ),
      label: 'Crea bozza nuova versione',
    }
    // TEMP PIN-645
    // const archiveAction = {
    //   onClick: wrapActionInDialog(archive),
    //   label: 'Archivia',
    // }
    const publishDraftAction = {
      onClick: wrapActionInDialog(
        wrapPublishDraft(eserviceId, descriptorId),
        'ESERVICE_VERSION_DRAFT_PUBLISH'
      ),
      label: 'Pubblica',
    }
    const deleteDraftAction = {
      onClick: wrapActionInDialog(
        wrapDeleteDraft(eserviceId, descriptorId),
        'ESERVICE_VERSION_DRAFT_DELETE'
      ),
      label: 'Elimina',
    }

    const availableActions: EServiceAction = {
      PUBLISHED: [suspendAction, cloneAction, createVersionDraftAction],
      ARCHIVED: [],
      DEPRECATED: [suspendAction /*, archiveAction */],
      DRAFT: [descriptorId ? publishDraftAction : null, deleteDraftAction],
      SUSPENDED: [reactivateAction, cloneAction, createVersionDraftAction],
    }

    // Return all the actions available for this particular status
    return availableActions[state || 'DRAFT'].filter((a) => a !== null) as Array<ActionProps>
  }

  // Data for the table head
  const headData = ['Nome E-Service', 'Versione', 'Stato E-Service']

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'I tuoi E-Service',
          description: "In quest'area puoi gestire tutti gli E-Service che stai erogando",
        }}
      </StyledIntro>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <StyledButton variant="contained" to={routes.PROVIDE_ESERVICE_CREATE.PATH}>
            + Aggiungi
          </StyledButton>
        </Box>

        <TempFilters />

        <TableWithLoader
          loadingText={loadingText}
          headData={headData}
          noDataLabel="Non ci sono servizi disponibili"
          error={axiosErrorToError(error)}
        >
          {data &&
            Boolean(data.length > 0) &&
            data.map((item, i) => (
              <StyledTableRow
                key={i}
                cellData={[
                  { label: item.name },
                  { label: item.version || '1' },
                  { label: ESERVICE_STATE_LABEL[item.state || 'DRAFT'] },
                ]}
              >
                <StyledButton
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    const destPath =
                      !item.state || item.state === 'DRAFT'
                        ? routes.PROVIDE_ESERVICE_EDIT.PATH
                        : routes.PROVIDE_ESERVICE_MANAGE.PATH

                    history.push(
                      buildDynamicPath(destPath, {
                        eserviceId: item.id,
                        descriptorId: item.descriptorId || URL_FRAGMENTS.FIRST_DRAFT[lang],
                      })
                    )
                  }}
                >
                  {!item.state || item.state === 'DRAFT' ? 'Modifica' : 'Ispeziona'}
                </StyledButton>

                <ActionMenu actions={getAvailableActions(item)} />
              </StyledTableRow>
            ))}
        </TableWithLoader>
      </Box>
    </React.Fragment>
  )
}

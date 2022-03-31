import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { number, object } from 'yup'
import {
  ActionProps,
  DecoratedPurpose,
  DialogUpdatePurposeDailyCallsFormInputValues,
  MappedRouteConfig,
  Purpose,
  PurposeState,
} from '../../types'
import { ActionMenu } from '../components/Shared/ActionMenu'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { TempFilters } from '../components/TempFilters'
import { PURPOSE_STATE_LABEL } from '../config/labels'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { RunActionOutput, useFeedback } from '../hooks/useFeedback'
import { useRoute } from '../hooks/useRoute'
import { DialogContext, PartyContext } from '../lib/context'
import { decoratePurposeWithMostRecentVersion } from '../lib/purpose'
import { buildDynamicPath } from '../lib/router-utils'
import { AxiosResponse } from 'axios'
import { PageTopFilters } from '../components/Shared/PageTopFilters'
import { Box } from '@mui/system'
// import { axiosErrorToError } from '../lib/error-utils'

type AsyncTableProps = {
  forceRerenderCounter: number
  getActions: (item: DecoratedPurpose) => Array<ActionProps>
  headData: Array<string>
  routes: Record<string, MappedRouteConfig>
}

const AsyncTable = ({ forceRerenderCounter, getActions, headData, routes }: AsyncTableProps) => {
  const history = useHistory()
  const { party } = useContext(PartyContext)

  const { data, loadingText /*, error */ } = useAsyncFetch<
    { purposes: Array<Purpose> },
    Array<DecoratedPurpose>
  >(
    { path: { endpoint: 'PURPOSE_GET_LIST' } },
    {
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando le finalità',
      mapFn: (data) =>
        data.purposes
          // TEMP REFACTOR: after integration with self care, this will not be necessary
          .filter((p) => p.consumerId === party?.id)
          .map(decoratePurposeWithMostRecentVersion),
      useEffectDeps: [forceRerenderCounter],
    }
  )

  return (
    <TableWithLoader
      loadingText={loadingText}
      headData={headData}
      noDataLabel="Non sono state create finalità"
      // error={axiosErrorToError(error)}
    >
      {data &&
        Boolean(data.length > 0) &&
        data.map((item, i) => {
          const purposeStateLabel = PURPOSE_STATE_LABEL[item.currentVersion.state]
          return (
            <StyledTableRow
              key={i}
              cellData={[
                { label: item.title },
                { label: item.eservice.name },
                { label: item.eservice.producer.name },
                {
                  label: item.awaitingApproval
                    ? `${purposeStateLabel}, in aggiornamento`
                    : purposeStateLabel,
                },
              ]}
            >
              <StyledButton
                variant="outlined"
                size="small"
                onClick={() => {
                  const path =
                    item.currentVersion.state === 'DRAFT'
                      ? routes.SUBSCRIBE_PURPOSE_EDIT.PATH
                      : routes.SUBSCRIBE_PURPOSE_VIEW.PATH

                  history.push(buildDynamicPath(path, { purposeId: item.id }))
                }}
              >
                {item.currentVersion.state === 'DRAFT' ? 'Modifica' : 'Ispeziona'}
              </StyledButton>

              <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
                <ActionMenu actions={getActions(item)} />
              </Box>
            </StyledTableRow>
          )
        })}
    </TableWithLoader>
  )
}

export const PurposeList = () => {
  const { runAction, forceRerenderCounter } = useFeedback()
  const { setDialog } = useContext(DialogContext)
  const { routes } = useRoute()

  /*
   * List of possible actions for the user to perform
   */
  const wrapUpdateDailyCalls = (purposeId: string) => async () => {
    setDialog({
      type: 'updatePurposeDailyCalls',
      initialValues: { dailyCalls: 1 },
      validationSchema: object({ dailyCalls: number().required() }),
      onSubmit: async ({ dailyCalls }: DialogUpdatePurposeDailyCallsFormInputValues) => {
        const { outcome, response } = (await runAction(
          {
            path: { endpoint: 'PURPOSE_VERSION_DRAFT_CREATE', endpointParams: { purposeId } },
            config: { data: { dailyCalls } },
          },
          { suppressToast: ['success'], silent: true }
        )) as RunActionOutput

        if (outcome === 'success') {
          const versionId = (response as AxiosResponse).data.id
          await runAction({
            path: {
              endpoint: 'PURPOSE_VERSION_ACTIVATE',
              endpointParams: { purposeId, versionId },
            },
          })
        }
      },
    })
  }

  const wrapDeleteVersion = (purpose: DecoratedPurpose) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_DELETE',
          endpointParams: { purposeId: purpose.id, versionId: purpose.mostRecentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapDelete = (purposeId: string) => async () => {
    await runAction(
      {
        path: { endpoint: 'PURPOSE_DRAFT_DELETE', endpointParams: { purposeId } },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapArchive = (purpose: DecoratedPurpose) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_ARCHIVE',
          endpointParams: { purposeId: purpose.id, versionId: purpose.currentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapSuspend = (purpose: DecoratedPurpose) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_SUSPEND',
          endpointParams: { purposeId: purpose.id, versionId: purpose.currentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapActivate = (purpose: DecoratedPurpose) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_ACTIVATE',
          endpointParams: { purposeId: purpose.id, versionId: purpose.currentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (purpose: DecoratedPurpose): Array<ActionProps> => {
    const archiveAction = { onClick: wrapArchive(purpose), label: 'Archivia' }
    const suspendAction = { onClick: wrapSuspend(purpose), label: 'Sospendi' }
    const activateAction = { onClick: wrapActivate(purpose), label: 'Attiva' }
    const deleteAction = { onClick: wrapDelete(purpose.id), label: 'Elimina' }
    const deleteVersionAction = {
      onClick: wrapDeleteVersion(purpose),
      label: 'Elimina aggiornamento numero chiamate',
    }

    const updateDailyCallsAction = {
      onClick: wrapUpdateDailyCalls(purpose.id),
      label: 'Aggiorna numero chiamate',
    }

    const availableActions: Record<PurposeState, Array<ActionProps>> = {
      DRAFT: [activateAction, deleteAction],
      ACTIVE: [suspendAction, updateDailyCallsAction],
      SUSPENDED: [activateAction, archiveAction],
      WAITING_FOR_APPROVAL: [purpose.versions.length > 1 ? deleteVersionAction : deleteAction],
      ARCHIVED: [],
    }

    const status = purpose.mostRecentVersion.state

    // Return all the actions available for this particular status
    return availableActions[status] || []
  }

  const headData = ['Nome finalità', 'E-Service', 'Ente erogatore', 'Stato', '']

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'Le tue finalità',
          description: "In quest'area puoi i trovare e gestire tutte le finalità che hai creato",
        }}
      </StyledIntro>

      <PageTopFilters>
        <TempFilters />
        <StyledButton variant="contained" size="small" to={routes.SUBSCRIBE_PURPOSE_CREATE.PATH}>
          + Aggiungi
        </StyledButton>
      </PageTopFilters>

      <AsyncTable
        forceRerenderCounter={forceRerenderCounter}
        getActions={getAvailableActions}
        headData={headData}
        routes={routes}
      />
    </React.Fragment>
  )
}

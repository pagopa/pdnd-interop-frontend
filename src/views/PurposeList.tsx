import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Box } from '@mui/system'
import { number, object } from 'yup'
import {
  ActionProps,
  DecoratedPurpose,
  DialogUpdatePurposeDailyCallsFormInputValues,
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
import { useFeedback } from '../hooks/useFeedback'
import { useRoute } from '../hooks/useRoute'
import { DialogContext } from '../lib/context'
import { formatThousands } from '../lib/number-utils'
import { decoratePurposeWithMostRecentVersion } from '../lib/purpose'
import { buildDynamicPath } from '../lib/router-utils'
// import { axiosErrorToError } from '../lib/error-utils'

export const PurposeList = () => {
  const history = useHistory()
  const { wrapActionInDialog, runAction } = useFeedback()
  const { setDialog } = useContext(DialogContext)
  const { routes } = useRoute()

  const { data, loadingText /*, error */ } = useAsyncFetch<
    { purposes: Array<Purpose> },
    Array<DecoratedPurpose>
  >(
    { path: { endpoint: 'PURPOSE_GET_LIST' } },
    {
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando le finalità',
      mapFn: (data) => data.purposes.map(decoratePurposeWithMostRecentVersion),
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapUpdateDailyCalls = (purposeId: string) => async () => {
    setDialog({
      type: 'updatePurposeDailyCalls',
      initialValues: { dailyCalls: 1 },
      validationSchema: object({ dailyCalls: number().required() }),
      onSubmit: async ({ dailyCalls }: DialogUpdatePurposeDailyCallsFormInputValues) => {
        await runAction(
          {
            path: { endpoint: 'PURPOSE_VERSION_DRAFT_CREATE', endpointParams: { purposeId } },
            config: { params: { dailyCalls } },
          },
          { suppressToast: false }
        )
      },
    })
  }

  const wrapDelete = (purposeId: string) => async () => {
    await runAction(
      {
        path: { endpoint: 'PURPOSE_DRAFT_DELETE', endpointParams: { purposeId } },
      },
      { suppressToast: false }
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
      { suppressToast: false }
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
      { suppressToast: false }
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
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (purpose: DecoratedPurpose): Array<ActionProps> => {
    const archiveAction = {
      onClick: wrapActionInDialog(wrapArchive(purpose), 'PURPOSE_VERSION_ARCHIVE'),
      label: 'Archivia',
    }

    const suspendAction = {
      onClick: wrapActionInDialog(wrapSuspend(purpose), 'PURPOSE_VERSION_SUSPEND'),
      label: 'Sospendi',
    }

    const reactivateAction = {
      onClick: wrapActionInDialog(wrapActivate(purpose), 'PURPOSE_VERSION_ACTIVATE'),
      label: 'Riattiva',
    }

    const deleteAction = {
      onClick: wrapActionInDialog(wrapDelete(purpose.id), 'PURPOSE_DRAFT_DELETE'),
      label: 'Elimina',
    }

    const updateDailyCallsAction = {
      onClick: wrapUpdateDailyCalls(purpose.id),
      label: 'Aggiorna numero chiamate',
    }

    const availableActions: Record<PurposeState, Array<ActionProps>> = {
      DRAFT: [deleteAction],
      ACTIVE: [suspendAction, updateDailyCallsAction],
      SUSPENDED: [reactivateAction, archiveAction],
      WAITING_FOR_APPROVAL: [updateDailyCallsAction],
      ARCHIVED: [],
    }

    const status = purpose.mostRecentVersion.state

    // Return all the actions available for this particular status
    return availableActions[status] || []
  }

  const headData = ['nome finalità', 'e-service', 'stima di carico', 'stato']

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'Le tue finalità',
          description: "In quest'area puoi i trovare e gestire tutte le finalità che hai creato",
        }}
      </StyledIntro>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <StyledButton variant="contained" to={routes.SUBSCRIBE_PURPOSE_CREATE.PATH}>
            + Aggiungi
          </StyledButton>
        </Box>

        <TempFilters />

        <TableWithLoader
          loadingText={loadingText}
          headData={headData}
          noDataLabel="Non ci sono finalità disponibili"
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
                    { label: formatThousands(item.currentVersion.dailyCalls) },
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

                  <ActionMenu actions={getAvailableActions(item)} />
                </StyledTableRow>
              )
            })}
        </TableWithLoader>
      </Box>
    </React.Fragment>
  )
}

import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ActionProps, DecoratedPurpose, Purpose, PurposeState } from '../../types'
import { ActionMenu } from '../components/Shared/ActionMenu'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { TempFilters } from '../components/TempFilters'
import { PURPOSE_STATE_LABEL } from '../config/labels'
import { ROUTES } from '../config/routes'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useFeedback } from '../hooks/useFeedback'
import { formatThousands } from '../lib/number-utils'
import { decoratePurposeWithMostRecentVersion } from '../lib/purpose'
import { buildDynamicPath } from '../lib/router-utils'
import { mockPurposeList } from '../temp/mock-purpose'
// import { axiosErrorToError } from '../lib/error-utils'

export const PurposeList = () => {
  const history = useHistory()
  const { wrapActionInDialog, runAction } = useFeedback()

  const { data, loadingText /*, error */ } = useAsyncFetch<Array<Purpose>>(
    {
      path: { endpoint: 'PURPOSE_GET_LIST' },
    },
    {
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando le finalità',
      // mapFn: (data) => data.map(decoratePurposeWithMostRecentVersion)
    }
  )
  const [mockData, setMockData] = useState<Array<DecoratedPurpose>>([])

  useEffect(() => {
    if (!data) {
      const decorated = mockPurposeList.map(decoratePurposeWithMostRecentVersion)
      setMockData(decorated)
    }
  }, [data])

  /*
   * List of possible actions for the user to perform
   */
  const wrapDelete = (purposeId: string) => async () => {
    await runAction(
      {
        path: { endpoint: 'PURPOSE_VERSION_DRAFT_DELETE', endpointParams: { purposeId } },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (purpose: DecoratedPurpose): Array<ActionProps> => {
    const deleteAction = {
      onClick: wrapActionInDialog(wrapDelete(purpose.id), 'PURPOSE_VERSION_DRAFT_DELETE'),
      label: 'Elimina',
    }

    const availableActions: Record<PurposeState, Array<ActionProps>> = {
      ACTIVE: [deleteAction],
      SUSPENDED: [],
      WAITING_FOR_APPROVAL: [deleteAction],
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
          <StyledButton variant="contained" to={ROUTES.SUBSCRIBE_PURPOSE_DRAFT_CREATE.PATH}>
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
          {mockData.map((item, i) => {
            const purposeStateLabel = PURPOSE_STATE_LABEL[item.currentVersion.state]
            return (
              <StyledTableRow
                key={i}
                cellData={[
                  { label: item.name },
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
                    history.push(
                      buildDynamicPath(ROUTES.SUBSCRIBE_PURPOSE_EDIT.PATH, { purposeId: item.id })
                    )
                  }}
                >
                  Ispeziona
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

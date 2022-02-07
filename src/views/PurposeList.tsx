import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ActionProps, Purpose, PurposeState } from '../../types'
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
import { buildDynamicPath } from '../lib/router-utils'

const _mock: Array<Purpose> = [
  {
    id: 'dsiofn-sdfjdsifnsds',
    name: 'Finalità 1',
    description: 'Descrizione finalità',
    eservice: {
      id: 'dsijfs-sfsdajfioa',
      name: 'TARI di Lozza',
      provider: {
        id: 'dniofdsn-iofdnsfdsfds-j',
        name: 'Comune di Lozza',
      },
    },
    dailyCalls: 20000,
    state: 'ACTIVE',
    riskAnalysis: {
      version: '1',
      answers: {},
    },
  },
]

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
    }
  )
  const [mockData, setMockData] = useState<Array<Purpose>>([])

  useEffect(() => {
    if (!data) {
      setMockData(_mock)
    }
  }, [data])

  /*
   * List of possible actions for the user to perform
   */
  const wrapDelete = (purposeId: string) => async () => {
    await runAction(
      {
        path: { endpoint: 'PURPOSE_DELETE', endpointParams: { purposeId } },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (purpose: Purpose): Array<ActionProps> => {
    const availableActions: Record<PurposeState, Array<ActionProps>> = {
      ACTIVE: [
        {
          onClick: wrapActionInDialog(wrapDelete(purpose.id), 'PURPOSE_DELETE'),
          label: 'Elimina',
        },
      ],
      SUSPENDED: [],
      PENDING: [],
      ARCHIVED: [],
    }

    const status = purpose.state

    // Return all the actions available for this particular status
    return availableActions[status] || []
  }

  const headData = ['nome finalità', 'e-service', 'stima di carico', 'stato', '']

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
          <StyledButton variant="contained" to={ROUTES.SUBSCRIBE_PURPOSE_CREATE.PATH}>
            + Aggiungi
          </StyledButton>
        </Box>

        <TempFilters />

        <TableWithLoader
          loadingText={loadingText}
          headData={headData}
          data={mockData}
          noDataLabel="Non ci sono finalità disponibili"
          // error={error}
        >
          {mockData.map((item, i) => (
            <StyledTableRow
              key={i}
              cellData={[
                { label: item.name },
                { label: item.eservice.name },
                { label: formatThousands(item.dailyCalls) },
                { label: PURPOSE_STATE_LABEL[item.state] },
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
          ))}
        </TableWithLoader>
      </Box>
    </React.Fragment>
  )
}

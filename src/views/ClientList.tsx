import React, { useContext } from 'react'
import { Box } from '@mui/system'
import { Client } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { TempFilters } from '../components/TempFilters'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext } from '../lib/context'
import { buildDynamicPath } from '../lib/router-utils'
import { StyledButton } from '../components/Shared/StyledButton'
import { ROUTES } from '../config/routes'
import { useUser } from '../hooks/useUser'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { useHistory } from 'react-router-dom'
import { axiosErrorToError } from '../lib/error-utils'

export function ClientList() {
  const { party } = useContext(PartyContext)
  const { user } = useUser()
  const history = useHistory()

  const { data, loadingText, error } = useAsyncFetch<Array<Client>>(
    {
      path: { endpoint: 'CLIENT_GET_LIST' },
      config: {
        params: {
          consumerId: party?.partyId,
          // If it is admin, it can see all clients; if operator, only those it is associated to
          operatorId: user && party && party.productInfo.role === 'security' ? user.id : undefined,
        },
      },
    },
    {
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando i client',
    }
  )

  const headData = ['nome client']

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'I tuoi client',
          description: "In quest'area puoi i trovare e gestire tutti i client che hai creato",
        }}
      </StyledIntro>

      <Box sx={{ mt: 4 }}>
        {isAdmin(party) && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <StyledButton variant="contained" to={ROUTES.SUBSCRIBE_CLIENT_CREATE.PATH}>
              + Aggiungi
            </StyledButton>
          </Box>
        )}

        <TempFilters />

        <TableWithLoader
          loadingText={loadingText}
          headData={headData}
          noDataLabel="Non ci sono client disponibili"
          error={axiosErrorToError(error)}
        >
          {data &&
            Boolean(data.length > 0) &&
            data.map((item, i) => (
              <StyledTableRow key={i} cellData={[{ label: item.name }]}>
                <StyledButton
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    history.push(
                      buildDynamicPath(ROUTES.SUBSCRIBE_CLIENT_EDIT.PATH, { clientId: item.id })
                    )
                  }}
                >
                  Ispeziona
                </StyledButton>
              </StyledTableRow>
            ))}
        </TableWithLoader>
      </Box>
    </React.Fragment>
  )
}

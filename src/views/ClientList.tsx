import React, { FunctionComponent, useContext } from 'react'
import { Box } from '@mui/system'
import { Client, ClientKind } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { TempFilters } from '../components/TempFilters'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext } from '../lib/context'
import { buildDynamicPath } from '../lib/router-utils'
import { StyledButton } from '../components/Shared/StyledButton'
import { useUser } from '../hooks/useUser'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { useHistory } from 'react-router-dom'
import { axiosErrorToError } from '../lib/error-utils'
import { useRoute } from '../hooks/useRoute'

type ClientListProps = {
  kind?: ClientKind
}

export const ClientList: FunctionComponent<ClientListProps> = ({ kind = 'consumer' }) => {
  const { party } = useContext(PartyContext)
  const { routes } = useRoute()
  const { user } = useUser()
  const history = useHistory()

  // Clients can be M2M clients for provider, or Purpose clients for subscriber
  const createPath =
    kind === 'consumer'
      ? routes.SUBSCRIBE_CLIENT_CREATE.PATH
      : routes.SUBSCRIBE_INTEROP_M2M_CLIENT_CREATE.PATH
  const editPath =
    kind === 'consumer'
      ? routes.SUBSCRIBE_CLIENT_EDIT.PATH
      : routes.SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT.PATH

  const { data, loadingText, error } = useAsyncFetch<Array<Client>>(
    {
      path: { endpoint: 'CLIENT_GET_LIST' },
      config: {
        params: {
          kind,
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
      {kind === 'consumer' && (
        <StyledIntro>
          {{
            title: 'I tuoi client',
            description: "In quest'area puoi i trovare e gestire tutti i client che hai creato",
          }}
        </StyledIntro>
      )}

      <Box sx={{ mt: 4 }}>
        {isAdmin(party) && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <StyledButton variant="contained" to={createPath}>
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
                    history.push(buildDynamicPath(editPath, { clientId: item.id }))
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

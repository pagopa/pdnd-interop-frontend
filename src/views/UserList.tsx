import React, { useContext } from 'react'
import { useLocation } from 'react-router'
import { User } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useMode } from '../hooks/useMode'
import { TempFilters } from '../components/TempFilters'
import { PartyContext, TokenContext } from '../lib/context'
import { getBits } from '../lib/router-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { USER_PLATFORM_ROLE_LABEL, USER_ROLE_LABEL, USER_STATE_LABEL } from '../config/labels'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { axiosErrorToError } from '../lib/error-utils'

export function UserList() {
  const location = useLocation()
  const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()

  // Only for subscriber
  const locationBits = getBits(location)
  const clientId = locationBits[locationBits.length - 1]

  const mode = useMode()
  const { party } = useContext(PartyContext)
  const { token } = useContext(TokenContext)
  const endpoint = mode === 'provider' ? 'USER_GET_LIST' : 'OPERATOR_SECURITY_GET_LIST' // TODO: remove after integration with selfcare
  const endpointParams =
    mode === 'provider' ? { institutionId: party?.institutionId } : { clientId }
  const params = mode === 'provider' ? { productRoles: ['admin', 'api'].join(',') } : {}

  const { data, loadingText, error } = useAsyncFetch<Array<User>>(
    { path: { endpoint, endpointParams }, config: { params } },
    {
      useEffectDeps: [forceRerenderCounter, token],
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando gli operatori',
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapRemoveFromClient = (relationshipId: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'OPERATOR_SECURITY_REMOVE_FROM_CLIENT',
          endpointParams: { relationshipId },
        },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  const headData = ['nome e cognome', 'ruolo', 'permessi', 'stato']

  return (
    <React.Fragment>
      {mode === 'provider' && (
        <StyledIntro>
          {{
            title: "Operatori API dell'ente",
            description:
              "In quest’area puoi trovare e gestire tutti gli operatori API che sono stati abilitati alla gestione degli e-service dell'ente",
          }}
        </StyledIntro>
      )}

      {/* {isAdmin(party) && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <StyledButton
            variant="contained"
            to={
              mode === 'provider'
                ? routes.PROVIDE_OPERATOR_CREATE.PATH
                : buildDynamicPath(routes.SUBSCRIBE_CLIENT_OPERATOR_CREATE.PATH, { clientId })
            }
          >
            + Aggiungi
          </StyledButton>
        </Box>
      )} */}

      <TempFilters />

      <TableWithLoader
        loadingText={loadingText}
        headData={headData}
        noDataLabel="Non ci sono operatori disponibili"
        error={axiosErrorToError(error)}
      >
        {data &&
          Boolean(data.length > 0) &&
          data.map((item, i) => (
            <StyledTableRow
              key={i}
              cellData={[
                { label: `${item.name + ' ' + item.surname}` },
                { label: item.role ? USER_ROLE_LABEL[item.role] : '' },
                { label: item.product.role ? USER_PLATFORM_ROLE_LABEL[item.product.role] : '' },
                { label: USER_STATE_LABEL[item.state] },
              ]}
            >
              <StyledButton
                variant="outlined"
                size="small"
                onClick={wrapActionInDialog(
                  wrapRemoveFromClient(item.id),
                  'OPERATOR_SECURITY_REMOVE_FROM_CLIENT'
                )}
              >
                Rimuovi
              </StyledButton>
            </StyledTableRow>
          ))}
      </TableWithLoader>
    </React.Fragment>
  )
}

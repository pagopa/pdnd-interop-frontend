import React, { FunctionComponent, useContext } from 'react'
import { useHistory } from 'react-router'
import { AddSecurityOperatorFormInputValues, ClientKind, User } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useMode } from '../hooks/useMode'
import { TempFilters } from '../components/TempFilters'
import { DialogContext, PartyContext } from '../lib/context'
import { getBits } from '../lib/router-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { Alert } from '@mui/material'
import { isAdmin } from '../lib/auth-utils'
import { fetchAllWithLogs } from '../lib/api-utils'
import { PageTopFilters } from '../components/Shared/PageTopFilters'
import { AsyncTableUser } from '../components/Shared/AsyncTableUser'

type UserListProps = {
  clientKind?: ClientKind
}

export const UserList: FunctionComponent<UserListProps> = ({ clientKind = 'CONSUMER' }) => {
  const history = useHistory()
  const { setDialog } = useContext(DialogContext)
  const { runAction, forceRerenderCounter } = useFeedback()

  // Only for subscriber
  const locationBits = getBits(history.location)
  const clientId = locationBits[locationBits.length - 1]

  const mode = useMode()
  const { party } = useContext(PartyContext)

  const addOperators = async (data: AddSecurityOperatorFormInputValues) => {
    if (data.selected.length === 0) {
      return
    }

    const lastSelected = data.selected.pop()

    // TEMP REFACTOR: this will go away with BFF
    await fetchAllWithLogs(
      data.selected.map(({ id }) => ({
        path: {
          endpoint: 'OPERATOR_SECURITY_JOIN_WITH_CLIENT',
          endpointParams: { clientId, relationshipId: id },
        },
      }))
    )

    // The last one also triggers the feedback toast
    await runAction({
      path: {
        endpoint: 'OPERATOR_SECURITY_JOIN_WITH_CLIENT',
        endpointParams: { clientId, relationshipId: (lastSelected as User).id },
      },
    })
  }

  const openAddOperatorDialog = () => {
    setDialog({
      type: 'addSecurityOperator',
      initialValues: { selected: [] },
      onSubmit: addOperators,
    })
  }

  return (
    <React.Fragment>
      {mode === 'provider' && (
        <StyledIntro>
          {{
            title: "Operatori API dell'ente",
            description:
              "In quest’area puoi trovare e gestire tutti gli operatori API che sono stati abilitati alla gestione degli E-Service dell'ente",
          }}
        </StyledIntro>
      )}

      <PageTopFilters>
        <TempFilters />
        {isAdmin(party) && mode === 'subscriber' && (
          <StyledButton variant="contained" size="small" onClick={openAddOperatorDialog}>
            + Aggiungi
          </StyledButton>
        )}
      </PageTopFilters>

      <AsyncTableUser
        forceRerenderCounter={forceRerenderCounter}
        runAction={runAction}
        clientId={clientId}
        clientKind={clientKind}
        mode={mode}
        party={party}
      />

      {mode === 'provider' && (
        <Alert sx={{ mt: 1 }} severity="info">
          Se l&rsquo;operatore non è in elenco, in questa fase di test contattaci per aggiungerlo
        </Alert>
      )}
    </React.Fragment>
  )
}

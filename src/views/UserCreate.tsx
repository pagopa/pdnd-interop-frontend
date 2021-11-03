import React, { useContext, useState } from 'react'
import { PlatformUserForm } from '../components/Shared/PlatformUserForm'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { MEDIUM_MAX_WIDTH, ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { useMode } from '../hooks/useMode'
import { useLocation } from 'react-router-dom'
import { buildDynamicRoute, parseSearch } from '../lib/url-utils'
import { ProviderOrSubscriber, UserOnCreate } from '../../types'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledForm } from '../components/Shared/StyledForm'

export function UserCreate() {
  const { runActionWithDestination } = useFeedback()
  const location = useLocation()
  const mode = useMode()
  const { party } = useContext(PartyContext)
  const [people, setPeople] = useState<Record<string, UserOnCreate>>({})

  const handleSubmit = async (e: React.SyntheticEvent) => {
    // Avoid page reload
    e.preventDefault()

    const { clientId } = parseSearch(location.search)

    const endpoint = mode === 'provider' ? 'OPERATOR_API_CREATE' : 'OPERATOR_SECURITY_CREATE'
    const endpointParams = mode === 'provider' ? {} : { clientId }
    const destination =
      mode === 'provider'
        ? ROUTES.PROVIDE.SUBROUTES!.OPERATOR_API_LIST
        : buildDynamicRoute(ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_EDIT, { id: clientId })

    const dataToPost =
      mode === 'provider'
        ? { users: [people['operator']], institutionId: party!.institutionId }
        : { ...people['operator'] }

    await runActionWithDestination(
      {
        path: { endpoint, endpointParams },
        config: {
          data: dataToPost,
        },
      },
      {
        destination,
        suppressToast: false,
      }
    )
  }

  const INTRO: { [key in ProviderOrSubscriber]: { title: string; description?: string } } = {
    provider: {
      title: 'Crea nuovo operatore API',
      description:
        "La figura dell'operatore API potrà gestire i tuoi servizi, crearne di nuovi, sospenderli e riattivarli, gestire le versioni. L'attivazione degli accordi di interoperabilità invece rimarrà esclusivamente sotto il controllo dell'Amministratore e dei suoi Delegati. Al nuovo utente verrà inviata una notifica all'indirizzo email indicato in questa form",
    },
    subscriber: {
      title: 'Crea nuovo operatore di sicurezza',
      description:
        "La figura dell'operatore di sicurezza potrà caricare una chiave pubblica per il client al quale è stato assegnato, ed eventualmente sospenderla o aggiornarla. Al nuovo utente verrà inviata una notifica all'indirizzo email indicato in questa form",
    },
  }

  return (
    <React.Fragment>
      <StyledIntro>{INTRO[mode!]}</StyledIntro>

      <StyledForm onSubmit={handleSubmit} style={{ maxWidth: MEDIUM_MAX_WIDTH }}>
        <PlatformUserForm
          prefix="operator"
          role="Operator"
          platformRole={mode === 'provider' ? 'api' : 'security'}
          people={people}
          setPeople={setPeople}
        />

        <StyledButton sx={{ mt: '1.5rem' }} variant="contained" type="submit" disabled={false}>
          Crea operatore
        </StyledButton>
      </StyledForm>
    </React.Fragment>
  )
}

import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { useMode } from '../hooks/useMode'
import { ProviderOrSubscriber, UserOnCreate } from '../../types'
import { MEDIUM_MAX_WIDTH, ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { buildDynamicRoute, parseSearch } from '../lib/url-utils'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledForm } from '../components/Shared/StyledForm'
import { PlatformUserControlledForm } from '../components/Shared/PlatformUserControlledForm'

export function UserCreate() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const { runActionWithDestination } = useFeedback()
  const location = useLocation()
  const mode = useMode()
  const { party } = useContext(PartyContext)

  const onSubmit = async ({ operator }: Record<string, Partial<UserOnCreate>>) => {
    const userData = {
      ...operator,
      role: 'Operator',
      platformRole: mode === 'provider' ? 'api' : 'security',
    }

    const { clientId } = parseSearch(location.search)

    const endpoint = mode === 'provider' ? 'OPERATOR_API_CREATE' : 'OPERATOR_SECURITY_CREATE'
    const endpointParams = mode === 'provider' ? {} : { clientId }
    const destination =
      mode === 'provider'
        ? ROUTES.PROVIDE.SUBROUTES!.OPERATOR_API_LIST
        : buildDynamicRoute(ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_EDIT, { id: clientId })

    const dataToPost =
      mode === 'provider' ? { users: [userData], institutionId: party!.institutionId } : userData

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

      <StyledForm onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: MEDIUM_MAX_WIDTH }}>
        <PlatformUserControlledForm prefix="operator" control={control} errors={errors} />

        <StyledButton sx={{ mt: 3 }} variant="contained" type="submit">
          Crea operatore
        </StyledButton>
      </StyledForm>
    </React.Fragment>
  )
}

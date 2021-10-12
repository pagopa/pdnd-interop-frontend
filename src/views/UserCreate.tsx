import React, { useContext, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { UsersObject } from '../components/OnboardingStep2'
import { PlatformUserForm } from '../components/PlatformUserForm'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import compose from 'lodash/fp/compose'
import { withAdminAuth } from '../components/withAdminAuth'
import { useMode } from '../hooks/useMode'
import { useLocation } from 'react-router-dom'
import { parseSearch } from '../lib/url-utils'
import { ProviderOrSubscriber } from '../../types'

function UserCreateComponent({ runActionWithDestination }: UserFeedbackHOCProps) {
  const location = useLocation()
  const mode = useMode()
  const { party } = useContext(PartyContext)
  const [people, setPeople] = useState<UsersObject>({})

  const handleSubmit = async (e: React.SyntheticEvent) => {
    // Avoid page reload
    e.preventDefault()

    const { clientId } = parseSearch(location.search)

    const endpoint = mode === 'provider' ? 'OPERATOR_API_CREATE' : 'OPERATOR_SECURITY_CREATE'
    const endpointParams = mode === 'provider' ? {} : { clientId }
    const destination =
      mode === 'provider'
        ? ROUTES.PROVIDE.SUBROUTES!.OPERATOR_API_LIST
        : {
            // TEMP REFACTOR: this case should also be taken into account
            PATH: `${ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_LIST.PATH}/${clientId}`,
            LABEL: '',
          }

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
    <WhiteBackground>
      <StyledIntro priority={2}>{INTRO[mode!]}</StyledIntro>

      <Form onSubmit={handleSubmit} style={{ maxWidth: 768 }}>
        <PlatformUserForm
          prefix="operator"
          role="Operator"
          platformRole={mode === 'provider' ? 'api' : 'security'}
          people={people}
          setPeople={setPeople}
        />

        <Button className="mt-3" variant="primary" type="submit" disabled={false}>
          crea operatore
        </Button>
      </Form>
    </WhiteBackground>
  )
}

export const UserCreate = compose(withUserFeedback, withAdminAuth)(UserCreateComponent)

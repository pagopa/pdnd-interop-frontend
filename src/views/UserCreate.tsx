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

function UserCreateComponent({ runAction }: UserFeedbackHOCProps) {
  const mode = useMode()
  const { party } = useContext(PartyContext)
  const [people, setPeople] = useState<UsersObject>({})

  const handleSubmit = async (e: React.SyntheticEvent) => {
    // Avoid page reload
    e.preventDefault()

    const endpoint = mode === 'provider' ? 'OPERATOR_API_CREATE' : 'OPERATOR_SECURITY_CREATE'
    const destRoute =
      mode === 'provider'
        ? ROUTES.PROVIDE.SUBROUTES!.OPERATOR_API_LIST
        : ROUTES.PROVIDE.SUBROUTES!.OPERATOR_SECURITY_LIST

    await runAction(
      {
        path: { endpoint },
        config: {
          method: 'POST',
          data: { users: [people['operator']], institutionId: party!.institutionId },
        },
      },
      destRoute
    )
  }

  return (
    <WhiteBackground>
      <StyledIntro>
        {{
          title: `Crea nuovo operatore API`,
          description:
            "La figura dell'operatore API potrà gestire i tuoi servizi, crearne di nuovi, sospenderli e riattivarli, gestire le versioni. L'attivazione degli accordi di interoperabilità invece rimarrà esclusivamente sotto il controllo dell'Amministratore e dei suoi Delegati",
        }}
      </StyledIntro>

      <Form onSubmit={handleSubmit} style={{ maxWidth: 768 }}>
        <PlatformUserForm
          prefix="operator"
          role="Operator"
          platformRole="api"
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

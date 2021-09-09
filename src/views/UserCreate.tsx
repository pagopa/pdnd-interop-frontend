import React, { useContext, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { UsersObject } from '../components/OnboardingStep2'
import { PlatformUserForm } from '../components/PlatformUserForm'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'

function UserCreateComponent({ runAction }: UserFeedbackHOCProps) {
  const { party } = useContext(PartyContext)
  const [people, setPeople] = useState<UsersObject>({})

  const handleSubmit = async (e: React.SyntheticEvent) => {
    // Avoid page reload
    e.preventDefault()

    await runAction(
      {
        path: { endpoint: 'USER_CREATE' },
        config: {
          method: 'POST',
          data: { users: [people['operator']], institutionId: party!.institutionId },
        },
      },
      ROUTES.PROVIDE.SUBROUTES!.USER_LIST
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

export const UserCreate = withUserFeedback(UserCreateComponent)

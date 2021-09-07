import React, { useContext, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { UsersObject } from '../components/OnboardingStep2'
import { PlatformUserForm } from '../components/PlatformUserForm'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { fetchWithLogs } from '../lib/api-utils'
import { ROUTES, TOAST_CONTENTS } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { getFetchOutcome } from '../lib/error-utils'

function UserCreateComponent({ showToast, setLoadingText }: UserFeedbackHOCProps) {
  const { party } = useContext(PartyContext)
  const [people, setPeople] = useState<UsersObject>({})
  const history = useHistory()

  // This can be refactored, but I need to think it through
  // The risk is to make the withUserFeedback HOC too complex
  const handleSubmit = async (e: React.SyntheticEvent) => {
    // Avoid page reload
    e.preventDefault()

    // Start the loader
    setLoadingText('Stiamo creando il nuovo operatore')

    // Make the request
    const userCreateResponse = await fetchWithLogs(
      { endpoint: 'USER_CREATE' },
      { method: 'POST', data: { users: [people['operator']], institutionId: party!.institutionId } }
    )

    if (getFetchOutcome(userCreateResponse) === 'success') {
      // toast in a new page
      history.push(ROUTES.PROVIDE.SUBROUTES!.USER_LIST.PATH, {
        toast: TOAST_CONTENTS.USER_CREATE.success,
      })
    } else {
      // toast here without going to the other page
      showToast(TOAST_CONTENTS.USER_CREATE.error)
    }

    // Stop the loader
    setLoadingText(undefined)
  }

  return (
    <WhiteBackground>
      <StyledIntro>{{ title: `Crea nuovo operatore` }}</StyledIntro>

      <Form onSubmit={handleSubmit}>
        <PlatformUserForm
          prefix="operator"
          role="Operator"
          platformRole="api"
          people={people}
          setPeople={setPeople}
        />

        <Button variant="primary" type="submit" disabled={false}>
          prosegui
        </Button>
      </Form>
    </WhiteBackground>
  )
}

export const UserCreate = withUserFeedback(UserCreateComponent)

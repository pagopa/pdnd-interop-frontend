import React, { useContext } from 'react'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { withLogin } from '../components/withLogin'
import { PartyContext, UserContext } from '../lib/context'

function ProfileComponent() {
  const { user } = useContext(UserContext)
  const { availableParties, party } = useContext(PartyContext)

  return (
    <WhiteBackground>
      <StyledIntro>{{ title: 'Il mio profilo' }}</StyledIntro>

      <DescriptionBlock label="Nome e cognome">
        <span>
          {user?.name} {user?.surname}
        </span>
      </DescriptionBlock>

      <DescriptionBlock label="Codice fiscale">
        <span>{user?.taxCode}</span>
      </DescriptionBlock>

      <DescriptionBlock label="Mail di notifica">
        <span>{user?.email}</span>
      </DescriptionBlock>

      <DescriptionBlock label="Attualmente stai operando per l'ente">
        <span>
          {party?.description} ({party?.role})
        </span>
      </DescriptionBlock>

      <DescriptionBlock label="Sei registrato su questa piattaforma per gli enti">
        <span>{availableParties.map((p) => `${p.description} (${p.role})`).join(', ')}</span>
      </DescriptionBlock>
    </WhiteBackground>
  )
}

export const Profile = withLogin(ProfileComponent)

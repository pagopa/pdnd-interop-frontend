import React, { useContext } from 'react'
import { Typography } from '@mui/material'
import { PartyContext, TokenContext } from '../lib/context'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { USER_ROLE_LABEL } from '../config/labels'
import { jwtToUser } from '../lib/jwt-utils'

export function Profile() {
  const { token } = useContext(TokenContext)
  const { availableParties, party } = useContext(PartyContext)
  const { name, surname, email } = jwtToUser(token as string)

  return (
    <React.Fragment>
      <StyledIntro>{{ title: 'Il mio profilo' }}</StyledIntro>

      <DescriptionBlock label="Nome e cognome">
        <Typography component="span">
          {name} {surname}
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Mail di notifica">
        <Typography component="span">{email}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Attualmente stai operando per l'ente">
        <Typography component="span">
          {party?.description} ({party ? USER_ROLE_LABEL[party.role] : ''})
        </Typography>
      </DescriptionBlock>

      {availableParties && (
        <DescriptionBlock label="Sei registrato su questa piattaforma per gli enti">
          <Typography component="span">
            {availableParties
              .map((p) => `${p.description} (${USER_ROLE_LABEL[p.role]})`)
              .join(', ')}
          </Typography>
        </DescriptionBlock>
      )}
    </React.Fragment>
  )
}

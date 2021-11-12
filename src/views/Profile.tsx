import React, { useContext } from 'react'
import { Typography } from '@mui/material'
import { PartyContext, UserContext } from '../lib/context'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { USER_ROLE_LABEL } from '../config/labels'

export function Profile() {
  const { user } = useContext(UserContext)
  const { availableParties, party } = useContext(PartyContext)

  return (
    <React.Fragment>
      <StyledIntro>{{ title: 'Il mio profilo' }}</StyledIntro>

      <DescriptionBlock label="Nome e cognome">
        <Typography component="span">
          {user?.name} {user?.surname}
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Codice fiscale">
        <Typography component="span">{user?.taxCode}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Mail di notifica">
        <Typography component="span">{user?.email}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Attualmente stai operando per l'ente">
        <Typography component="span">
          {party?.description} ({party ? USER_ROLE_LABEL[party!.role] : ''})
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Sei registrato su questa piattaforma per gli enti">
        <Typography component="span">
          {availableParties.map((p) => `${p.description} (${USER_ROLE_LABEL[p.role]})`).join(', ')}
        </Typography>
      </DescriptionBlock>
    </React.Fragment>
  )
}

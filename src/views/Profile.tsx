import React, { useContext } from 'react'
import { Typography } from '@mui/material'
import { PartyContext } from '../lib/context'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useUser } from '../hooks/useUser'
import { useTranslation } from 'react-i18next'

export function Profile() {
  const { t } = useTranslation('common')
  const { availableParties, party } = useContext(PartyContext)
  const { user } = useUser()

  return (
    <React.Fragment>
      <StyledIntro>{{ title: 'Il mio profilo' }}</StyledIntro>

      <DescriptionBlock label="Nome e cognome">
        <Typography component="span">
          {user?.name} {user?.surname}
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Mail di notifica">
        <Typography component="span">{user?.email}</Typography>
      </DescriptionBlock>

      <DescriptionBlock label="Attualmente stai operando per l'ente">
        <Typography component="span">
          {party?.description} ({party ? t(`userRole.${party.role}`) : ''})
        </Typography>
      </DescriptionBlock>

      {availableParties && (
        <DescriptionBlock label="Sei registrato su questa piattaforma per gli enti">
          <Typography component="span">
            {availableParties
              .map((p) => `${p.description} (${t(`userRole.${p.role}`)})`)
              .join(', ')}
          </Typography>
        </DescriptionBlock>
      )}
    </React.Fragment>
  )
}

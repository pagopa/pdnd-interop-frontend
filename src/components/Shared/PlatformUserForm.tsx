import React from 'react'
import { Box } from '@mui/system'
import { InfoOutlined as InfoOutlinedIcon } from '@mui/icons-material'
import { UserOnCreate, UserPlatformRole, UserRole } from '../../../types'
import { StyledInputText } from './StyledInputText'
import { Typography } from '@mui/material'

type PlatformUserFormProps = {
  prefix: string
  role: UserRole
  platformRole: UserPlatformRole
  people: Record<string, UserOnCreate>
  setPeople: React.Dispatch<React.SetStateAction<Record<string, UserOnCreate>>>
}

export function PlatformUserForm({
  prefix,
  role,
  platformRole,
  people,
  setPeople,
}: PlatformUserFormProps) {
  const buildSetPerson = (key: string) => (e: any) => {
    setPeople({
      ...people,
      [prefix]: { ...people[prefix], [key]: e.target.value, role, platformRole },
    })
  }

  const peoplePrefix = people[prefix]

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ py: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ mr: 2, flexGrow: 1 }}>
          <StyledInputText
            id="name"
            label="Nome*"
            value={peoplePrefix && peoplePrefix['name'] ? peoplePrefix['name'] : ''}
            onChange={buildSetPerson('name')}
          />
        </Box>
        <Box sx={{ ml: 2, flexGrow: 1 }}>
          <StyledInputText
            id="surname"
            label="Cognome*"
            value={peoplePrefix && peoplePrefix['surname'] ? peoplePrefix['surname'] : ''}
            onChange={buildSetPerson('surname')}
          />
        </Box>
      </Box>
      <Box sx={{ py: 2 }}>
        <StyledInputText
          id="taxCode"
          label="Codice Fiscale*"
          value={peoplePrefix && peoplePrefix['taxCode'] ? peoplePrefix['taxCode'] : ''}
          onChange={buildSetPerson('taxCode')}
        />
      </Box>
      <Box sx={{ py: 2 }}>
        <StyledInputText
          id="email"
          label="Email ad uso aziendale*"
          type="email"
          value={people[prefix] && people[prefix]['email'] ? people[prefix]['email'] : ''}
          onChange={buildSetPerson('email')}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <InfoOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />
          <Typography component="span" variant="caption">
            Inserisci l'indirizzo email ad uso aziendale utilizzato per l'Ente
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

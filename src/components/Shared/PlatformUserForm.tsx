import { Box } from '@mui/system'
import React from 'react'
import { UserOnCreate, UserPlatformRole, UserRole } from '../../../types'
import { UsersObject } from '../OnboardingStep2'
import { StyledInputText, StyledInputTextType } from './StyledInputText'

type PlatformUserFormProps = {
  prefix: keyof UsersObject
  role: UserRole
  platformRole: UserPlatformRole
  people: UsersObject
  setPeople: React.Dispatch<React.SetStateAction<UsersObject>>
}

type Field = {
  id: keyof UserOnCreate
  label: string
  type?: 'text' | 'email'
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

  const fields: Field[] = [
    { id: 'name', label: 'Nome*' },
    { id: 'surname', label: 'Cognome*' },
    { id: 'taxCode', label: 'Codice Fiscale*' },
    { id: 'email', label: 'Email*', type: 'email' },
  ]

  return (
    <React.Fragment>
      {fields.map(({ id, label, type = 'text' }, i) => (
        <Box sx={{ my: '3rem' }} key={i}>
          <StyledInputText
            id={`${prefix}-${id}`}
            label={label}
            type={type as StyledInputTextType}
            // Below, ugly hack to prevent React from complaining.
            // Controlled components values cannot start as 'undefined'
            value={people[prefix] && people[prefix][id] ? people[prefix][id] : ''}
            onChange={buildSetPerson(id)}
          />
        </Box>
      ))}
    </React.Fragment>
  )
}

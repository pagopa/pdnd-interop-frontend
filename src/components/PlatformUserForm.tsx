import React from 'react'
import { UserCreate, UserPlatformRole, UserRole } from '../../types'
import { UsersObject } from './OnboardingStep2'
import { StyledInputText, StyledInputTextType } from './StyledInputText'

type PlatformUserFormProps = {
  prefix: keyof UsersObject
  role: UserRole
  platformRole: UserPlatformRole
  people: UsersObject
  setPeople: React.Dispatch<React.SetStateAction<UsersObject>>
}

type Field = {
  id: keyof UserCreate
  label: string
  placeholder: string
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
    {
      id: 'name',
      label: 'Nome',
      placeholder: 'Mario',
    },
    {
      id: 'surname',
      label: 'Cognome',
      placeholder: 'Rossi',
    },
    {
      id: 'taxCode',
      label: 'Codice Fiscale',
      placeholder: 'RSSMR',
    },
    {
      id: 'email',
      label: 'Email',
      placeholder: 'mario.rossi@example.com',
      type: 'email',
    },
  ]

  return (
    <React.Fragment>
      {fields.map(({ id, label, placeholder, type = 'text' }, i) => (
        <React.Fragment key={i}>
          <StyledInputText
            id={`${prefix}-${id}`}
            label={label}
            type={type as StyledInputTextType}
            placeholder={placeholder}
            // Below, ugly hack to prevent React from complaining.
            // Controlled components values cannot start as 'undefined'
            value={people[prefix] && people[prefix][id] ? people[prefix][id] : ''}
            onChange={buildSetPerson(id)}
          />
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}

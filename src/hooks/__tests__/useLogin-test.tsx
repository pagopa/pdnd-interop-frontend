import React, { FunctionComponent, useContext, useState } from 'react'
import { render, screen } from '@testing-library/react'
import { UserContext } from '../../lib/context'
import { useLogin } from '../useLogin'
import { User } from '../../../types'
import userEvent from '@testing-library/user-event'
import { storageWrite } from '../../lib/storage-utils'

type TestComponentProps = {
  userData: User
}

const TestLoginProvider: FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

function TestSilentLoginSubscriber() {
  const { silentLoginAttempt } = useLogin()
  const { user } = useContext(UserContext)

  return (
    <div>
      <button
        onClick={() => {
          silentLoginAttempt()
        }}
      >
        silent login
      </button>
      <div>{user ? `${user.name} ${user.surname}` : 'nessun utente'}</div>
    </div>
  )
}

function TestLoginConsumer({ userData }: TestComponentProps) {
  const { doLogin } = useLogin()
  const { user } = useContext(UserContext)

  return (
    <div>
      <button
        onClick={() => {
          doLogin(userData)
        }}
      >
        login
      </button>
      <div>{user ? `${user.name} ${user.surname}` : 'nessun utente'}</div>
    </div>
  )
}

it('Logs in', async () => {
  const userData: User = {
    name: 'Antonio',
    surname: 'Berielli',
    taxCode: 'BRLNTN67E11L405R',
    email: 'antonio.berielli@test.it',
    status: 'active',
    role: 'Manager',
    platformRole: 'admin',
  }

  const { getByText } = render(
    <TestLoginProvider>
      <TestLoginConsumer userData={userData} />
    </TestLoginProvider>
  )
  expect(getByText('nessun utente')).toBeInTheDocument()

  userEvent.click(screen.getByText('login'))
  expect(getByText(`${userData.name} ${userData.surname}`)).toBeInTheDocument()
})

fit('Logs in silently', async () => {
  const userData: User = {
    name: 'Antonio',
    surname: 'Berielli',
    taxCode: 'BRLNTN67E11L405R',
    email: 'antonio.berielli@test.it',
    status: 'active',
    role: 'Manager',
    platformRole: 'admin',
  }
  storageWrite('user', userData, 'object')

  const { getByText } = render(
    <TestLoginProvider>
      <TestSilentLoginSubscriber />
    </TestLoginProvider>
  )
  expect(getByText('nessun utente')).toBeInTheDocument()

  userEvent.click(screen.getByText('silent login'))
  expect(getByText(`${userData.name} ${userData.surname}`)).toBeInTheDocument()
})

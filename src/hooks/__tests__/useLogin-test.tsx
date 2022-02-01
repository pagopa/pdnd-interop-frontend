import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { useLogin } from '../useLogin'
import { storageWrite } from '../../lib/storage-utils'
import { STORAGE_KEY_TOKEN } from '../../lib/constants'
import { AllTheProviders } from '../../__mocks__/providers'
import { token } from '../../__mocks__/token'
import { useUser } from '../useUser'
import { jwtToUser } from '../../lib/jwt-utils'

function TestSilentLoginSubscriber() {
  const { silentLoginAttempt } = useLogin()
  const { user } = useUser()

  return (
    <div>
      <button
        onClick={async () => {
          await silentLoginAttempt()
        }}
      >
        silent login
      </button>
      <div>{user ? `${user.name} ${user.surname}` : 'nessun utente'}</div>
    </div>
  )
}

it('Logs in silently', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  mockedAxios.request.mockImplementationOnce(() => Promise.resolve({ isAxiosError: false }))

  storageWrite(STORAGE_KEY_TOKEN, token, 'string')
  const userData = jwtToUser(token)

  const { getByText } = render(
    <AllTheProviders>
      <TestSilentLoginSubscriber />
    </AllTheProviders>
  )
  expect(getByText('nessun utente')).toBeInTheDocument()

  userEvent.click(screen.getByText('silent login'))
  await waitFor(() => {
    expect(getByText(`${userData.name} ${userData.surname}`)).toBeInTheDocument()
  })
})

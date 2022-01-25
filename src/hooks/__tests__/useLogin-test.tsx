import React, { useContext } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { useLogin } from '../useLogin'
import { TokenContext } from '../../lib/context'
import { storageWrite } from '../../lib/storage-utils'
import { STORAGE_KEY_TOKEN } from '../../lib/constants'
import { jwtToUser } from '../../lib/jwt-utils'
import { AllTheProviders } from '../../__mocks__/providers'
import { token } from '../../__mocks__/token'

function TestSilentLoginSubscriber() {
  const { silentLoginAttempt } = useLogin()
  const { token } = useContext(TokenContext)
  const user = token && jwtToUser(token)

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

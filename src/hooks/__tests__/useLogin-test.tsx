import React, { FunctionComponent, useContext, useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { useLogin } from '../useLogin'
import { TokenContext } from '../../lib/context'
import { storageWrite } from '../../lib/storage-utils'
import { STORAGE_KEY_TOKEN } from '../../lib/constants'
import { jwtToUser } from '../../lib/jwt-utils'

const TestLoginProvider: FunctionComponent = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  return <TokenContext.Provider value={{ token, setToken }}>{children}</TokenContext.Provider>
}

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

  const tokenData =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImYyNmUwM2RiLWY4YjMtNDk5ZS04ZjMyLTA3MmM5M2VjZjc2MSJ9.eyJlbWFpbCI6ImNhcmxhLnJvc3NpQHRlc3QucGFnb3BhLml0IiwiZmFtaWx5X25hbWUiOiJSb3NzaSIsImZpc2NhbF9udW1iZXIiOiJJU1BYTkIzMlI4Mlk3NjZEIiwibW9iaWxlX3Bob25lIjoiMzMzMzMzMzMzIiwibmFtZSI6IkNhcmxhIiwiZnJvbV9hYSI6ZmFsc2UsInVpZCI6ImZiMjgwNGQwLTllN2QtNGIwNC05MjVhLWNhNmY4MDJhNzI4MiIsImxldmVsIjoiTDIiLCJpYXQiOjE2NDI1ODg2ODEsImV4cCI6MTY0MjU5MjI4MSwiaXNzIjoiU1BJRCIsImp0aSI6IjAxRlNSWU1DVlAwTTA1WkFXWFdIVlJNWldBIn0.oZODSEMPduJ4ExsDOm7Ddn9m6oFgt_qtABR3RfgV26NiCPZfEAuiAHz3x23m2xz3bP5-XPSpfT4JBD6biAxZlV0C_1HV83KHOy9ylweKNeyPQZxRn_wfZ2I4taC6PC0Nc-6YJ3KrzXsEJOtQQWm3FMG4LrWnChz4Smn16gjrjQ1X3lW2UDbef9qI9nvpaZW1bUmxjxYXN2FLv5I_gkWUxtiCgCcVPD8fVfyk8dh4mM_I1-aswktX65UiGhgTZfwa6O-10enhbN03bmIKp800WRcx_xslIaD8REviBRJcTqQLDTMe5Omt0ylSLzy7XBodMpuyjghh9K-Yojr67x7KpA'
  storageWrite(STORAGE_KEY_TOKEN, tokenData, 'string')
  const userData = jwtToUser(tokenData)

  const { getByText } = render(
    <TestLoginProvider>
      <TestSilentLoginSubscriber />
    </TestLoginProvider>
  )
  expect(getByText('nessun utente')).toBeInTheDocument()

  userEvent.click(screen.getByText('silent login'))
  await waitFor(() => {
    expect(getByText(`${userData.name} ${userData.surname}`)).toBeInTheDocument()
  })
})

import React from 'react'
import * as useTOSAgreement from '@/router/hooks/useTOSAgreement'
import * as useCurrentRoute from '@/router/hooks/useCurrentRoute'
import * as Contexts from '@/contexts'
import { afterEach, vi } from 'vitest'
import noop from 'lodash/noop'
import { render, screen } from '@testing-library/react'
import RoutesWrapper from '../RoutesWrapper'
import { Route, Router, Routes } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientMock } from '@/__mocks__/query-client.mock'

const AuthContextProviderMock = ({ children }: { children: React.ReactNode }) => <>{children}</>

const useTOSAgreementSpy = vi.spyOn(useTOSAgreement, 'useTOSAgreement')
const useCurrentRouteSpy = vi.spyOn(useCurrentRoute, 'default')
vi.spyOn(Contexts, 'AuthContextProvider').mockImplementation(AuthContextProviderMock)

afterEach(() => {
  useTOSAgreementSpy.mockClear()
  useCurrentRouteSpy.mockClear()
})

function renderRoutesWrapper() {
  const history = createMemoryHistory()
  history.push('/ui/it/termini-di-servizio')
  const renderMethods = render(
    <QueryClientProvider client={queryClientMock}>
      <Router location={history.location} navigator={history}>
        <Routes>
          <Route element={<RoutesWrapper />}>
            <Route path="/ui/it/termini-di-servizio" element={<></>} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  )

  return { history, ...renderMethods }
}

describe('determine whether business logic to check for user authorizazion works', () => {
  it('should show TOSAgreement component if TOS has not been accepted and the route is not public', () => {
    useTOSAgreementSpy.mockImplementation(() => ({
      isTOSAccepted: false,
      handleAcceptTOS: noop,
      tosAcceptedId: 'test',
    }))

    renderRoutesWrapper()
    screen.debug(undefined, Infinity)
  })

  // it('should show TOSAgreement component if TOS has not been accepted and the route is not public', () => {
  //   useCurrentRouteSpy.mockImplementation(
  //     () => ({ isPublic: false } as ReturnType<typeof useCurrentRoute.default>)
  //   )
  //   useTOSAgreementSpy.mockImplementation(() => ({
  //     isTOSAccepted: true,
  //     handleAcceptTOS: noop,
  //     tosAcceptedId: 'test',
  //   }))

  //   renderRoutesWrapper()
  //   const confirmTOSButton = screen.getByRole('button', { name: 'confirmBtnLabel' })
  //   const titleTOS = screen.getByRole('heading', { name: 'title' })

  //   expect(confirmTOSButton).toBeInTheDocument()
  //   expect(titleTOS).toBeInTheDocument()
  // })
})

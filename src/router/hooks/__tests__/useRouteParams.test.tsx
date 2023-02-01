import React from 'react'
import { renderHook } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Route, Router, Routes } from 'react-router-dom'
import useRouteParams from '../useRouteParams'
import { routes } from '@/router/routes'

describe('tests if useRouteParams works correctly', () => {
  it('Should return the correct params on a route with dynamic segments', () => {
    const memoryHistory = createMemoryHistory()
    memoryHistory.push('/it/erogazione/e-service/test-eserviceId/test-descriptorId/modifica')
    const { result } = renderHook(() => useRouteParams(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <Router location={memoryHistory.location} navigator={memoryHistory}>
          <Routes>
            <Route path={`/it/${routes.PROVIDE_ESERVICE_EDIT.PATH.it}`} element={children} />
          </Routes>
        </Router>
      ),
    })

    expect(result.current).toEqual({
      eserviceId: 'test-eserviceId',
      descriptorId: 'test-descriptorId',
    })
  })

  it('Should return the correct params on a route without dynamic segments', () => {
    const memoryHistory = createMemoryHistory()
    memoryHistory.push('/it/erogazione/e-service')
    const { result } = renderHook(() => useRouteParams(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <Router location={memoryHistory.location} navigator={memoryHistory}>
          <Routes>
            <Route path={`/it/${routes.PROVIDE_ESERVICE_LIST.PATH.it}`} element={children} />
          </Routes>
        </Router>
      ),
    })

    expect(result.current).toEqual({})
  })
})

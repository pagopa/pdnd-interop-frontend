import { renderHook } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { useSwitchPathLang } from '../useSwitchPathLang'
import { Route, Router, Routes } from 'react-router-dom'
import { act } from 'react-dom/test-utils'

describe('useSwitchPathLang testing', () => {
  it('Should return the path translated', () => {
    const memoryHistory = createMemoryHistory()
    memoryHistory.push('/it/erogazione')
    const { result } = renderHook(() => useSwitchPathLang(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <Router location={memoryHistory.location} navigator={memoryHistory}>
          <Routes>
            <Route path={'/it/erogazione'} element={children} />
            <Route path={'/en/provider'} element={children} />
          </Routes>
        </Router>
      ),
    })

    act(() => {
      result.current.switchPathLang('en')
    })

    expect(memoryHistory.location.pathname).toBe('/ui/en/provider')
  })

  it('Should keep the url params on switch path language', () => {
    const memoryHistory = createMemoryHistory()
    memoryHistory.push('/it/erogazione?test=test')
    const { result } = renderHook(() => useSwitchPathLang(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <Router location={memoryHistory.location} navigator={memoryHistory}>
          <Routes>
            <Route path={'/it/erogazione'} element={children} />
            <Route path={'/en/provider'} element={children} />
          </Routes>
        </Router>
      ),
    })

    act(() => {
      result.current.switchPathLang('en')
    })

    expect(memoryHistory.location.pathname).toBe('/ui/en/provider')
    expect(memoryHistory.location.search).toBe('?test=test')
  })

  it('Should keep the url hash on switch path language', () => {
    const memoryHistory = createMemoryHistory()
    memoryHistory.push('/it/erogazione#test')
    const { result } = renderHook(() => useSwitchPathLang(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <Router location={memoryHistory.location} navigator={memoryHistory}>
          <Routes>
            <Route path={'/it/erogazione'} element={children} />
            <Route path={'/en/provider'} element={children} />
          </Routes>
        </Router>
      ),
    })

    act(() => {
      result.current.switchPathLang('en')
    })

    expect(memoryHistory.location.pathname).toBe('/ui/en/provider')
    expect(memoryHistory.location.hash).toBe('#test')
  })

  it('Should keep the url hash and search params on switch path language', () => {
    const memoryHistory = createMemoryHistory()
    memoryHistory.push('/it/erogazione?test=test#test')
    const { result } = renderHook(() => useSwitchPathLang(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <Router location={memoryHistory.location} navigator={memoryHistory}>
          <Routes>
            <Route path={'/it/erogazione'} element={children} />
            <Route path={'/en/provider'} element={children} />
          </Routes>
        </Router>
      ),
    })

    act(() => {
      result.current.switchPathLang('en')
    })

    expect(memoryHistory.location.pathname).toBe('/ui/en/provider')
    expect(memoryHistory.location.hash).toBe('#test')
    expect(memoryHistory.location.search).toBe('?test=test')
  })

  it('Should keep the url hash and search params on switch path language', () => {
    const memoryHistory = createMemoryHistory()
    memoryHistory.push('/it/fruizione/catalogo-e-service/testid1/testid2')
    const { result } = renderHook(() => useSwitchPathLang(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <Router location={memoryHistory.location} navigator={memoryHistory}>
          <Routes>
            <Route
              path={'/it/fruizione/catalogo-e-service/:eserviceId/:descriptorId'}
              element={children}
            />
            <Route
              path={'/en/subscriber/e-service-catalog/:eserviceId/:descriptorId'}
              element={children}
            />
          </Routes>
        </Router>
      ),
    })

    act(() => {
      result.current.switchPathLang('en')
    })

    expect(memoryHistory.location.pathname).toBe(
      '/ui/en/subscriber/e-service-catalog/testid1/testid2'
    )
  })
})

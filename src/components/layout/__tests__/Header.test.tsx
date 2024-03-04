import React from 'react'
import { Header } from '../Header'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/interop-fe-commons'

describe('Header', () => {
  it('should match snapshot (not logged)', () => {
    mockUseJwt({ jwt: undefined, isSupport: false })
    const tree = renderWithApplicationContext(
      <ThemeProvider theme={theme}>
        <Header />
      </ThemeProvider>,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
    expect(tree.baseElement).toMatchSnapshot()
  })

  it('should match snapshot (logged - not support)', () => {
    mockUseJwt({ isSupport: false })
    const tree = renderWithApplicationContext(
      <ThemeProvider theme={theme}>
        <Header />
      </ThemeProvider>,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
    expect(tree.baseElement).toMatchSnapshot()
  })

  it('should match snapshot (logged - support)', () => {
    mockUseJwt({ isSupport: true })
    const tree = renderWithApplicationContext(
      <ThemeProvider theme={theme}>
        <Header />
      </ThemeProvider>,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
    expect(tree.baseElement).toMatchSnapshot()
  })
})

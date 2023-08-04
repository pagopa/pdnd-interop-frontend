import React from 'react'
import { Header } from '../Header'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/interop-fe-commons'
import { createMockJwtUser } from '__mocks__/data/user.mocks'

mockUseJwt()

describe('Header', () => {
  it('should match snapshot (not logged)', () => {
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
    const tree = renderWithApplicationContext(
      <ThemeProvider theme={theme}>
        <Header jwt={createMockJwtUser()} />
      </ThemeProvider>,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
    expect(tree.baseElement).toMatchSnapshot()
  })

  it('should match snapshot (logged - support)', () => {
    const tree = renderWithApplicationContext(
      <ThemeProvider theme={theme}>
        <Header jwt={createMockJwtUser()} isSupport />
      </ThemeProvider>,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
    expect(tree.baseElement).toMatchSnapshot()
  })
})

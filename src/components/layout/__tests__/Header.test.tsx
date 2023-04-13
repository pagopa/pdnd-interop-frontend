import React from 'react'
import { Header } from '../Header'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/interop-fe-commons'

mockUseJwt()

describe('Header', () => {
  it('should match snapshot', () => {
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

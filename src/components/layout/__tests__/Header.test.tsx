import React from 'react'
import { Header } from '../Header'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import * as useJwtHook from '@/hooks/useJwt'
import { mockUseJwt } from '__mocks__/data/user.mocks'
import { vi } from 'vitest'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/interop-fe-commons'

vi.spyOn(useJwtHook, 'useJwt').mockImplementation(() => mockUseJwt())

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

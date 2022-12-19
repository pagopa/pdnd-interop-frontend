import React from 'react'
import { renderWithApplicationContext } from '@/__mocks__/mock.utils'
import Redirect from '../Redirect'
import { routes } from '@/router/routes'
import { createMemoryHistory } from 'history'

describe('Redirect component tests', () => {
  it('should redirect correctly', () => {
    const { history } = renderWithApplicationContext(<Redirect to="PARTY_REGISTRY" />, {
      withRouterContext: true,
    })

    expect(history.location.pathname).toContain(routes.PARTY_REGISTRY.PATH.it)
  })

  it('should redirect correctly with dynamic params', () => {
    const { history } = renderWithApplicationContext(
      <Redirect to="PROVIDE_AGREEMENT_READ" params={{ agreementId: 'Test' }} />,
      {
        withRouterContext: true,
      }
    )

    expect(history.location.pathname).toContain(
      routes.PROVIDE_AGREEMENT_READ.PATH.it.replace(':agreementId', 'Test')
    )
  })

  it('should keep the hash on redirect', () => {
    const history = createMemoryHistory()
    history.push('/#test')

    renderWithApplicationContext(
      <Redirect to="SUBSCRIBE_CATALOG_LIST" />,
      {
        withRouterContext: true,
      },
      history
    )

    expect(history.location.pathname).toContain(routes.SUBSCRIBE_CATALOG_LIST.PATH.it)
    expect(history.location.hash).toBe('#test')
  })

  it('should keep the url params on redirect', () => {
    const history = createMemoryHistory()
    history.push('/?test=test')

    renderWithApplicationContext(
      <Redirect to="SUBSCRIBE_CATALOG_LIST" />,
      {
        withRouterContext: true,
      },
      history
    )

    expect(history.location.pathname).toContain(routes.SUBSCRIBE_CATALOG_LIST.PATH.it)
    expect(history.location.search).toBe('?test=test')
  })
})

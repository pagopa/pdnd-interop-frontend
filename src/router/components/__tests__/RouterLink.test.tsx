import React from 'react'
import { renderWithApplicationContext } from '@/__mocks__/mock.utils'
import { RouterLink } from '@/router'
import userEvent from '@testing-library/user-event'
import { routes } from '@/router/routes'

describe('determine whether business logic to navigate works', () => {
  it('navigates between routes as link', async () => {
    const user = userEvent.setup()
    const { history, getByRole } = renderWithApplicationContext(<RouterLink to="TOS" />, {
      withRouterContext: true,
    })
    const link = getByRole('link')

    expect(history.location.pathname).toEqual('/')

    await user.click(link)
    expect(history.location.pathname).toContain(routes.TOS.PATH.it)
  })

  it('navigates between routes with dynamic paths as link', async () => {
    const user = userEvent.setup()
    const { history, getByRole } = renderWithApplicationContext(
      <RouterLink
        to="PROVIDE_ESERVICE_MANAGE"
        params={{ eserviceId: 'eserviceId', descriptorId: 'descriptorId' }}
      />,
      {
        withRouterContext: true,
      }
    )
    const link = getByRole('link')

    expect(history.location.pathname).toEqual('/')

    await user.click(link)
    expect(history.location.pathname).toContain(
      routes.PROVIDE_ESERVICE_MANAGE.PATH.it.replace(/:/g, '')
    )
  })

  it('navigates between routes as button', async () => {
    const user = userEvent.setup()
    const { history, getByRole } = renderWithApplicationContext(
      <RouterLink to="TOS" as="button">
        TOS
      </RouterLink>,
      {
        withRouterContext: true,
      }
    )
    const link = getByRole('button')

    expect(history.location.pathname).toEqual('/')

    await user.click(link)
    expect(history.location.pathname).toContain(routes.TOS.PATH.it)
  })

  it('navigates between routes with dynamic paths as button', async () => {
    const user = userEvent.setup()
    const { history, getByRole } = renderWithApplicationContext(
      <RouterLink
        to="PROVIDE_ESERVICE_MANAGE"
        params={{ eserviceId: 'eserviceId', descriptorId: 'descriptorId' }}
        as="button"
      >
        PROVIDE ESERVICE MANAGE
      </RouterLink>,
      {
        withRouterContext: true,
      }
    )
    const link = getByRole('button')

    expect(history.location.pathname).toEqual('/')

    await user.click(link)
    expect(history.location.pathname).toContain(
      routes.PROVIDE_ESERVICE_MANAGE.PATH.it
        .replace(/:eserviceId/g, 'eserviceId')
        .replace(/:descriptorId/g, 'descriptorId')
    )
  })

  it('correctly sets the url params passed', async () => {
    const user = userEvent.setup()
    const { history, getByRole } = renderWithApplicationContext(
      <RouterLink
        to="SUBSCRIBE_CATALOG_LIST"
        options={{ urlParams: { testParam1: 'testParam1', testParam2: 'testParam2' } }}
      />,
      {
        withRouterContext: true,
      }
    )
    const link = getByRole('link')

    expect(history.location.pathname).toEqual('/')

    await user.click(link)
    expect(history.location.pathname).toContain(routes.SUBSCRIBE_CATALOG_LIST.PATH.it)
    expect(history.location.search).toContain('?testParam1=testParam1&testParam2=testParam2')
  })
})

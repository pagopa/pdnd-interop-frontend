import React from 'react'
import { createMockEServiceCatalog } from '@/../__mocks__/data/eservice.mocks'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { parseAsString, useQueryState } from 'nuqs'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'
import { PARENT_QUERY_PARAMS_STATE_KEY } from '@/router'
import { EServiceCatalogCard } from '../components/EServiceCatalogCard'

mockUseJwt()

function CatalogCardWithFilter() {
  const [, setKeyword] = useQueryState('keyword', parseAsString)
  const [eservice] = React.useState(() => createMockEServiceCatalog())

  return (
    <>
      <button onClick={() => setKeyword('updated')}>update-filter</button>
      <EServiceCatalogCard eservice={eservice} prefetchFn={() => {}} disabled={false} />
    </>
  )
}

describe('Checks CatalogCard button', () => {
  it('navigate correctly when click on button inspect', async () => {
    const user = userEvent.setup()
    const eserviceMock = createMockEServiceCatalog()
    const { history, ...screen } = renderWithApplicationContext(
      <EServiceCatalogCard eservice={eserviceMock} prefetchFn={() => {}} disabled={false} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
    const inspectLink = screen.getByRole('link', { name: 'actions.inspectEService' })
    expect(history.location.pathname).toEqual('/')
    await user.click(inspectLink)
    expect(history.location.pathname).toBe(
      `/it/catalogo-e-service/${eserviceMock.id}/${eserviceMock.activeDescriptor?.id}`
    )
  })

  it('passes the current shallow-updated query parameters to the details page', async () => {
    window.history.replaceState({}, '', '/it/catalogo-e-service?keyword=initial&offset=9')
    const router = createBrowserRouter([
      {
        path: '/it/catalogo-e-service',
        element: (
          <NuqsAdapter>
            <CatalogCardWithFilter />
          </NuqsAdapter>
        ),
      },
      { path: '/it/catalogo-e-service/:eserviceId/:descriptorId', element: <div>details</div> },
    ])
    const user = userEvent.setup()
    const view = renderWithApplicationContext(<RouterProvider router={router} />, {})

    try {
      await user.click(screen.getByRole('button', { name: 'update-filter' }))
      await waitFor(() => expect(window.location.search).toBe('?keyword=updated&offset=9'))
      await user.click(screen.getByRole('link', { name: 'actions.inspectEService' }))

      expect(await screen.findByText('details')).toBeInTheDocument()
      expect(router.state.location.state).toEqual({
        [PARENT_QUERY_PARAMS_STATE_KEY]: 'keyword=updated&offset=9',
      })
    } finally {
      view.unmount()
      router.dispose()
      window.history.replaceState({}, '', '/')
    }
  })

  it('renders correctly when disabled is true', () => {
    const eserviceMock = createMockEServiceCatalog()
    const { getByRole } = renderWithApplicationContext(
      <EServiceCatalogCard eservice={eserviceMock} prefetchFn={() => {}} disabled={true} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
    const disabledTooltipWrapper = getByRole('button', { name: 'list.disabledTooltip' })

    expect(disabledTooltipWrapper).toBeInTheDocument()
    expect(disabledTooltipWrapper).toHaveAttribute('aria-disabled', 'true')
  })

  it('does not render tooltip wrapper when disabled is false', () => {
    const eserviceMock = createMockEServiceCatalog()
    const { queryByRole } = renderWithApplicationContext(
      <EServiceCatalogCard eservice={eserviceMock} prefetchFn={() => {}} disabled={false} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )

    const disabledTooltipWrapper = queryByRole('button', { name: 'list.disabledTooltip' })

    expect(disabledTooltipWrapper).not.toBeInTheDocument()
  })
})

import React from 'react'
import { createMockEServiceCatalog } from '@/../__mocks__/data/eservice.mocks'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import userEvent from '@testing-library/user-event'
import { EServiceCatalogCard } from '../components/EServiceCatalogCard'

mockUseJwt()

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
    const inspectLink = screen.getByRole('button', { name: 'actions.inspectEService' })
    expect(history.location.pathname).toEqual('/')
    await user.click(inspectLink)
    expect(history.location.pathname).toBe(
      `/it/catalogo-e-service/${eserviceMock.id}/${eserviceMock.activeDescriptor?.id}`
    )
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

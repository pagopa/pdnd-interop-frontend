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
    const inspectLink = getByRole('button', { name: 'actions.inspectEService' })
    expect(inspectLink).toBeDisabled()
  })
})

describe('EServiceCatalogCard component', () => {
  it('should render stacked card layout when isCollection is true', () => {
    const eserviceMock = createMockEServiceCatalog()
    const { getByRole, getByText, queryByRole } = renderWithApplicationContext(
      <EServiceCatalogCard
        eservice={eserviceMock}
        prefetchFn={() => {}}
        disabled={false}
        isCollection={true}
      />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )

    expect(getByText('list.collectionBadge')).toBeInTheDocument()
    expect(getByRole('button', { name: 'list.inspectCollection' })).toBeInTheDocument()
    expect(queryByRole('button', { name: 'actions.inspectEService' })).not.toBeInTheDocument()
  })
})

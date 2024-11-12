import React from 'react'
import { CatalogCard } from '../CatalogCard'
import { createMockEServiceCatalog } from '@/../__mocks__/data/eservice.mocks'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import userEvent from '@testing-library/user-event'

mockUseJwt()

describe('Checks CatalogCard button', () => {
  it('navigate correctly when click on button inspect', async () => {
    const user = userEvent.setup()
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'ACTIVE',
        canBeUpgraded: false,
      },
    })
    const { history, ...screen } = renderWithApplicationContext(
      <CatalogCard eservice={eserviceMock} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
    const inspectLink = screen.getByRole('link', { name: 'actions.inspect' })
    expect(history.location.pathname).toEqual('/')
    await user.click(inspectLink)
    expect(history.location.pathname).toBe(
      `/it/fruizione/catalogo-e-service/${eserviceMock.id}/${eserviceMock.activeDescriptor?.id}`
    )
  })
})

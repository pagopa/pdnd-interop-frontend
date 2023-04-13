import React from 'react'
import * as hooks from '@/hooks/useJwt'
import { vi } from 'vitest'
import { CatalogCard, CatalogCardSkeleton } from '../CatalogCard'
import { createMockEServiceCatalog } from '__mocks__/data/eservice.mocks'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { mockUseJwt } from '__mocks__/data/user.mocks'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const useJwtReturnDataMock = mockUseJwt()
vi.spyOn(hooks, 'useJwt').mockImplementation(() => useJwtReturnDataMock)

describe("Checks that CatalogCard snapshot don't change", () => {
  it('renders correctly the skeleton', () => {
    const card = render(<CatalogCardSkeleton />)
    expect(card.baseElement).toMatchSnapshot()
  })

  it('renders correctly with isMine false and hasCertifiedAttributes true', () => {
    const eserviceMock = createMockEServiceCatalog({
      isMine: false,
      hasCertifiedAttributes: true,
      agreement: undefined,
    })
    const card = renderWithApplicationContext(<CatalogCard eservice={eserviceMock} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(card.baseElement).toMatchSnapshot()
  })

  it('renders correctly with isMine true and hasCertifiedAttributes true', () => {
    const eserviceMock = createMockEServiceCatalog({
      isMine: true,
      hasCertifiedAttributes: true,
      agreement: undefined,
    })
    const card = renderWithApplicationContext(<CatalogCard eservice={eserviceMock} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(card.baseElement).toMatchSnapshot()
  })

  it('renders correctly with isMine false and hasCertifiedAttributes false', () => {
    const eserviceMock = createMockEServiceCatalog({
      isMine: true,
      hasCertifiedAttributes: false,
      agreement: undefined,
    })
    const card = renderWithApplicationContext(<CatalogCard eservice={eserviceMock} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(card.baseElement).toMatchSnapshot()
  })

  it('renders correctly with isMine false and agreement ACTIVE', () => {
    const eserviceMock = createMockEServiceCatalog({
      isMine: false,
      agreement: {
        id: 'test',
        state: 'ACTIVE',
        canBeUpgraded: false,
      },
    })
    const card = renderWithApplicationContext(<CatalogCard eservice={eserviceMock} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(card.baseElement).toMatchSnapshot()
  })

  it('renders correctly with isMine true and agreement ACTIVE', () => {
    const eserviceMock = createMockEServiceCatalog({
      isMine: true,
      agreement: {
        id: 'test',
        state: 'ACTIVE',
        canBeUpgraded: false,
      },
    })
    const card = renderWithApplicationContext(<CatalogCard eservice={eserviceMock} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(card.baseElement).toMatchSnapshot()
  })

  it('renders correctly with isMine true and agreement ACTIVE', () => {
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'DRAFT',
        canBeUpgraded: false,
      },
    })
    const card = renderWithApplicationContext(<CatalogCard eservice={eserviceMock} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(card.baseElement).toMatchSnapshot()
  })

  it('navigate correctly when click on button inspect', async () => {
    const user = userEvent.setup()
    const eserviceMock = createMockEServiceCatalog({
      agreement: {
        id: 'test',
        state: 'ACTIVE',
        canBeUpgraded: false,
      },
    })
    const { history } = renderWithApplicationContext(<CatalogCard eservice={eserviceMock} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    const buttons = screen.queryAllByRole('button')

    expect(history.location.pathname).toEqual('/')

    await user.click(buttons[0])
    expect(history.location.pathname).toBe(
      `/it/fruizione/catalogo-e-service/${eserviceMock.id}/${eserviceMock.activeDescriptor?.id}`
    )
  })
})

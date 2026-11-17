import React from 'react'
import { createMockEServiceCatalog } from '@/../__mocks__/data/eservice.mocks'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceStackedCatalogCard } from '../components/EServiceStackedCatalogCard'

mockUseJwt()

describe('Checks StackedCatalogCard button', () => {
  const baseProps = {
    collectionBadgeLabel: 'Collection',
    collectionCtaLabel: 'Inspect collection',
    disabledTooltip: 'Disabled tooltip',
    prefetchFn: () => {},
    onInspectClick: () => {},
  }

  it('renders disabled tooltip wrapper when disabled is true', () => {
    const eserviceMock = createMockEServiceCatalog()
    const { getByRole } = renderWithApplicationContext(
      <EServiceStackedCatalogCard {...baseProps} eservice={eserviceMock} disabled={true} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )

    const disabledTooltipWrapper = getByRole('button')

    expect(disabledTooltipWrapper).toBeInTheDocument()
    expect(disabledTooltipWrapper).toHaveAttribute('aria-disabled', 'true')
  })

  it('does not render disabled tooltip wrapper when disabled is false', () => {
    const eserviceMock = createMockEServiceCatalog()
    const { queryByRole } = renderWithApplicationContext(
      <EServiceStackedCatalogCard {...baseProps} eservice={eserviceMock} disabled={false} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )

    const disabledTooltipWrapper = queryByRole('button', {
      name: 'Disabled tooltip',
    })

    expect(disabledTooltipWrapper).not.toBeInTheDocument()
  })
})

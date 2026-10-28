import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import ConsumerEServiceCatalogPage from '../ConsumerEServiceCatalog.page'

vi.mock('@/components/layout/containers', () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/components/shared/banners/ProductUpdatesBanner', () => ({
  ProductUpdatesBanner: () => null,
}))

vi.mock('../FeaturedTab', () => ({
  default: ({ onGoToCatalog }: { onGoToCatalog: () => void }) => (
    <div>
      Featured e-services
      <button onClick={onGoToCatalog}>Vai al catalogo</button>
    </div>
  ),
}))

vi.mock('../AllEServicesTabRename', () => ({
  default: () => <div>All e-services</div>,
}))

const renderPage = (searchParams = '') => {
  const onUrlUpdate = vi.fn()
  const result = renderWithApplicationContext(<ConsumerEServiceCatalogPage />, {
    withRouterContext: true,
    nuqsTestingAdapterProps: { searchParams, hasMemory: true, onUrlUpdate },
  })

  return { ...result, onUrlUpdate }
}

describe('ConsumerEServiceCatalogPage', () => {
  it('selects the featured tab by default', () => {
    renderPage()

    expect(screen.getByRole('tablist', { name: 'tabs.ariaLabel' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'tabs.featured' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByRole('tab', { name: 'tabs.allEServices' })).toHaveAttribute(
      'aria-selected',
      'false'
    )
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Featured e-services')
    expect(screen.queryByText('All e-services')).not.toBeInTheDocument()
  })

  it.each([
    { tab: 'featured', label: 'tabs.featured', content: 'Featured e-services' },
    { tab: 'allEServices', label: 'tabs.allEServices', content: 'All e-services' },
  ])('reads the $tab tab from the URL', ({ tab, label, content }) => {
    renderPage(`?tab=${tab}`)

    expect(screen.getByRole('tab', { name: label })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent(content)
  })

  it('switches between tabs when their labels are clicked', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('tab', { name: 'tabs.allEServices' }))

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'tabs.allEServices' })).toHaveAttribute(
        'aria-selected',
        'true'
      )
      expect(screen.getByRole('tabpanel')).toHaveTextContent('All e-services')
    })
    expect(screen.queryByText('Featured e-services')).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'tabs.featured' }))

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'tabs.featured' })).toHaveAttribute(
        'aria-selected',
        'true'
      )
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Featured e-services')
    })
    expect(screen.queryByText('All e-services')).not.toBeInTheDocument()
  })

  it.each([
    { role: 'tab', name: 'tabs.allEServices' },
    { role: 'button', name: 'Vai al catalogo' },
  ])('opens the catalog and resets pagination and filters using $name', async ({ role, name }) => {
    const user = userEvent.setup()
    const { onUrlUpdate } = renderPage(
      '?tab=featured&offset=6&signingStates=SIGNED&eservicesIds=123'
    )

    await user.click(screen.getByRole(role, { name }))

    await waitFor(() => {
      expect(screen.getByRole('tabpanel')).toHaveTextContent('All e-services')
      expect(onUrlUpdate).toHaveBeenCalled()
      const { searchParams } = onUrlUpdate.mock.lastCall![0]
      expect(searchParams.get('tab')).toBe('allEServices')
      expect(searchParams.has('offset')).toBe(false)
      expect(searchParams.has('signingStates')).toBe(false)
      expect(searchParams.has('eservicesIds')).toBe(false)
    })
  })
})

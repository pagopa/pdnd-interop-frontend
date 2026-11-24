import React from 'react'
import type * as ReactI18next from 'react-i18next'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockAgreement,
  createMockAgreementListingItem,
} from '@/../__mocks__/data/agreement.mocks'
import { AgreementServices } from '@/api/agreement'
import type { MIPaginationProps } from '@pagopa/mui-italia'
import { ConsumerAgreementsTable } from '../ConsumerAgreementsTable'

vi.mock('react-i18next', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactI18next>()),
  useTranslation: () => ({
    t: (key: string, options?: { name?: string; version?: string }) =>
      options?.name ? `${key} ${options.name} ${options.version}` : key,
    i18n: { language: 'it' },
  }),
}))

const agreement = createMockAgreementListingItem({
  eservice: { name: 'Population registry', producer: { name: 'Registry provider' } },
  descriptor: { version: '2' },
})

const renderTable = (agreements = [agreement], isLoading = false, pagination?: MIPaginationProps) =>
  renderWithApplicationContext(
    <>
      <h1 id="page-title">title</h1>
      <ConsumerAgreementsTable
        agreements={agreements}
        isLoading={isLoading}
        pagination={pagination}
      />
    </>,
    {
      withRouterContext: true,
      withReactQueryContext: true,
    }
  )

const originalMatchMedia = window.matchMedia

afterEach(() => {
  vi.stubGlobal('matchMedia', originalMatchMedia)
})

describe('ConsumerAgreementsTable', () => {
  beforeEach(() => {
    mockUseJwt({ isAdmin: false })
    vi.spyOn(AgreementServices, 'getSingle').mockResolvedValue(createMockAgreement())
  })

  it('renders every column and its corresponding agreement content', () => {
    renderTable()

    const table = within(screen.getByRole('table'))
    expect(table.getByRole('columnheader', { name: 'eserviceName' })).toBeInTheDocument()
    expect(table.getByRole('columnheader', { name: 'providerName' })).toBeInTheDocument()
    expect(table.getByRole('columnheader', { name: 'agreementStatus' })).toBeInTheDocument()
    expect(
      table.getByRole('cell', { name: 'eserviceName Population registry 2' })
    ).toBeInTheDocument()
    expect(table.getByRole('cell', { name: /Registry provider/ })).toBeInTheDocument()
    expect(table.getByRole('cell', { name: 'status.agreement.ACTIVE' })).toBeInTheDocument()
  })

  it.each([
    { state: 'ACTIVE', isAdmin: true, action: 'inspect', suffix: '' },
    { state: 'DRAFT', isAdmin: true, action: 'edit', suffix: '/modifica' },
    { state: 'DRAFT', isAdmin: false, action: 'inspect', suffix: '' },
  ] as const)(
    'opens $action for $state agreements (admin: $isAdmin) using the keyboard',
    async ({ state, isAdmin, action, suffix }) => {
      mockUseJwt({ isAdmin })
      const { history } = renderTable([createMockAgreementListingItem({ state })])
      const user = userEvent.setup()
      const link = screen.getByRole('link', { name: action })
      const expectedPath = `/it/fruizione/richieste/${agreement.id}${suffix}`

      expect(link).toHaveAttribute('href', expectedPath)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      expect(
        screen.queryByRole('link', { name: action === 'edit' ? 'inspect' : 'edit' })
      ).not.toBeInTheDocument()
      for (let i = 0; i < 3 && document.activeElement !== link; i++) {
        await user.tab()
      }
      expect(link).toHaveFocus()
      await user.keyboard('{Enter}')

      expect(history.location.pathname).toBe(expectedPath)
    }
  )

  it.each([
    { state: 'ACTIVE', isAdmin: false, canBeUpgraded: true, action: 'inspect' },
    { state: 'SUSPENDED', isAdmin: true, canBeUpgraded: true, action: 'inspect' },
    { state: 'DRAFT', isAdmin: true, canBeUpgraded: false, action: 'edit' },
    { state: 'REJECTED', isAdmin: true, canBeUpgraded: false, action: 'inspect' },
    { state: 'ACTIVE', isAdmin: true, canBeUpgraded: false, action: 'inspect' },
  ] as const)(
    'uses canBeUpgraded=$canBeUpgraded for the $action link on $state agreements',
    async ({ state, isAdmin, canBeUpgraded, action }) => {
      mockUseJwt({ isAdmin })
      renderTable([createMockAgreementListingItem({ state, canBeUpgraded })])
      const user = userEvent.setup()
      const label = canBeUpgraded ? `${action}. upgradableAgreementTooltip` : action

      await user.hover(screen.getByRole('link', { name: label }))

      if (canBeUpgraded) {
        expect(await screen.findByRole('tooltip')).toHaveTextContent('upgradableAgreementTooltip')
      } else {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      }
    }
  )

  it('keeps the delegation indicator for the current organization', () => {
    renderTable([
      createMockAgreementListingItem({
        delegation: {
          id: 'delegation-id',
          delegator: { id: 'organizationId', name: 'Delegator' },
          delegate: { id: 'delegate-id', name: 'Delegate' },
        },
      }),
    ])

    expect(screen.getByText('label.delegator')).toBeInTheDocument()
  })
})

describe.each(['desktop', 'mobile'])('ConsumerAgreementsTable on %s', (layout) => {
  const pagination: MIPaginationProps = {
    count: 3,
    page: 1,
    onChange: vi.fn(),
    itemsPerPageOptions: { limit: 10, options: [10, 24, 36], onLimitChange: vi.fn() },
  }

  beforeEach(() => {
    mockUseJwt()
    vi.spyOn(AgreementServices, 'getSingle').mockResolvedValue(createMockAgreement())
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: layout === 'mobile',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    )
  })

  it.each([false, true])(
    'shows provider tooltips only for clipped text (clipped: %s)',
    async (clipped) => {
      const rootName = 'Root organization'
      renderTable([
        createMockAgreementListingItem({
          eservice: {
            producer: {
              name: 'Registry provider',
              subUnitType: 'UO',
              parentTenants: [{ id: 'root', name: rootName }],
            },
          },
        }),
      ])
      const user = userEvent.setup()
      const providerName = `Registry provider - ${rootName}`
      const provider = screen.getByText(providerName)
      const root = screen.getByText(rootName)
      for (const element of [provider, root]) {
        Object.defineProperty(element, 'clientWidth', { configurable: true, value: 100 })
        Object.defineProperty(element, 'scrollWidth', {
          configurable: true,
          value: clipped ? 101 : 100,
        })
      }

      await user.tab()
      expect(provider).toHaveFocus()
      if (clipped) {
        expect(await screen.findByRole('tooltip')).toHaveTextContent(providerName)
      } else {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
        expect(provider).not.toHaveAttribute('title')
      }

      await user.tab()
      expect(root).toHaveFocus()
      if (clipped) {
        expect(await screen.findByRole('tooltip')).toHaveTextContent(rootName)
      } else {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
        expect(root).not.toHaveAttribute('title')
      }

      await user.tab()
      await user.hover(provider)
      if (clipped) {
        expect(await screen.findByRole('tooltip')).toHaveTextContent(providerName)
      } else {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
        expect(provider).not.toHaveAttribute('title')
      }
    }
  )

  it('exposes labelled data and the details navigation without row actions', async () => {
    const { history } = renderTable()
    const container = screen.getByRole(layout === 'mobile' ? 'group' : 'table', {
      name: 'title',
    })
    const content = within(container)
    const user = userEvent.setup()

    if (layout === 'mobile') {
      expect(content.getByRole('definition', { name: 'eserviceName' })).toHaveTextContent(
        'eserviceName Population registry 2'
      )
      expect(content.getByRole('definition', { name: 'providerName' })).toHaveTextContent(
        'Registry provider'
      )
      expect(content.getByRole('definition', { name: 'agreementStatus' })).toHaveTextContent(
        'status.agreement.ACTIVE'
      )
    }

    expect(content.queryByRole('button')).not.toBeInTheDocument()
    await user.click(content.getByRole('link', { name: 'inspect' }))

    expect(history.location.pathname).toBe(`/it/fruizione/richieste/${agreement.id}`)
  })

  it('shows the localized no-results message when empty', () => {
    renderTable([], false, pagination)

    expect(screen.getByText('noDataLabel')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('renders the integrated page and page-size controls', () => {
    renderTable([agreement], false, pagination)

    expect(screen.getByRole('navigation', { name: 'pagination navigation' })).toBeInTheDocument()
    expect(
      screen.getByRole('combobox', { name: 'Select number of items per page' })
    ).toHaveTextContent('10')
  })

  it('announces loading without showing no-results or navigation', () => {
    renderTable([agreement], true, pagination)

    expect(
      screen.getByRole(layout === 'mobile' ? 'group' : 'table', { name: 'title' })
    ).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText('noDataLabel')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})

import React from 'react'
import { screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { ConsumerPurposeTemplateLinkedResourceTab } from '../ConsumerPurposeTemplateLinkedResourceTab'
import { createMockPurposeTemplate } from '../../../../../../__mocks__/data/purposeTemplate.mocks'

vi.mock(
  '@/components/shared/PurposeTemplate/PurposeTemplateLinkedResourceTab/ConsumerPurposeTemplateLinkedResourceTable',
  () => ({
    ConsumerPurposeTemplateLinkedResourceTable: () => <div data-testid="linked-resource-table" />,
    ConsumerPurposeTemplateLinkedResourceTableSkeleton: () => (
      <div data-testid="linked-resource-table-skeleton" />
    ),
  })
)

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const dict: Record<string, string> = {
        title: 'E-service e template e-service suggeriti',
        description: 'Qui trovi l’elenco unificato.',
        editButtonTooltip: 'Non modificabile',
      }
      return dict[key] ?? key
    },
    i18n: { language: 'it' },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}))

describe('ConsumerPurposeTemplateLinkedResourceTab', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ routeKey: 'SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS' })
  })

  it('renders the renamed section title for the unified resources tab', () => {
    renderWithApplicationContext(
      <ConsumerPurposeTemplateLinkedResourceTab
        purposeTemplate={createMockPurposeTemplate({ state: 'PUBLISHED' })}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByText('E-service e template e-service suggeriti')).toBeInTheDocument()
  })

  it('renders the inner ConsumerPurposeTemplateLinkedResourceTable', () => {
    renderWithApplicationContext(
      <ConsumerPurposeTemplateLinkedResourceTab
        purposeTemplate={createMockPurposeTemplate({ state: 'PUBLISHED' })}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByTestId('linked-resource-table')).toBeInTheDocument()
  })

  it('exposes the edit action when state is PUBLISHED and user is admin on the detail route', () => {
    renderWithApplicationContext(
      <ConsumerPurposeTemplateLinkedResourceTab
        purposeTemplate={createMockPurposeTemplate({ state: 'PUBLISHED' })}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByRole('button', { name: /modifica|edit/i })).toBeEnabled()
  })

  it('disables the edit action when state is ARCHIVED', () => {
    renderWithApplicationContext(
      <ConsumerPurposeTemplateLinkedResourceTab
        purposeTemplate={createMockPurposeTemplate({ state: 'ARCHIVED' })}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByRole('button', { name: /modifica|edit/i })).toBeDisabled()
  })
})

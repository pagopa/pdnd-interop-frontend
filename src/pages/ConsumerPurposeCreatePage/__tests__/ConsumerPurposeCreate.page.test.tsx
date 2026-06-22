import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import ConsumerPurposeCreatePage from '../ConsumerPurposeCreate.page'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'

mockUseJwt()
vi.mock('./../components/PurposeCreateForm', () => ({
  PurposeCreateForm: () => <div>PurposeCreateForm</div>,
}))

describe('ConsumerPurposeCreatePage', () => {
  it('renders page title', () => {
    renderWithApplicationContext(<ConsumerPurposeCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('create.emptyTitle')).toBeInTheDocument()
  })
  it('renders required label', () => {
    renderWithApplicationContext(<ConsumerPurposeCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('requiredLabel')).toBeInTheDocument()
  })
})

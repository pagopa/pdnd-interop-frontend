import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import ConsumerPurposeCreatePage from '../ConsumerPurposeCreate.page'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'

mockUseJwt()
const useQueryMock = vi.fn()

describe('ConsumerPurposeCreatePage', () => {
  it('renders page title', () => {
    useQueryMock.mockReturnValue({
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('create.emptyTitle')).toBeInTheDocument()
  })
  it('renders required label', () => {
    useQueryMock.mockReturnValue({
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('create.requiredLabel')).toBeInTheDocument()
  })
})

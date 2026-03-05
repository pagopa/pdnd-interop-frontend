import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import ConsumerPurposeFromTemplateEditPage from '../ConsumerPurposeFromTemplateEdit.page'

mockUseJwt()
const useQueryMock = vi.fn()

describe('ConsumerPurposeFromTemplateEditPage', () => {
  it('renders back to list button', () => {
    useQueryMock.mockReturnValue({
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeFromTemplateEditPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('backToListBtn')).toBeInTheDocument()
  })
  it('renders required label', () => {
    useQueryMock.mockReturnValue({
      isLoading: false,
    })

    renderWithApplicationContext(<ConsumerPurposeFromTemplateEditPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('edit.requiredLabel')).toBeInTheDocument()
  })
})

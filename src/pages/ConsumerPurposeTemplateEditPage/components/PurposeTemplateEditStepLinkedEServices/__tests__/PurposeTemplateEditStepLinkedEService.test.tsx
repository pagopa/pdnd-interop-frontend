import React from 'react'
import { render } from '@testing-library/react'
import type { Mock } from 'vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { PurposeTemplateEditLinkedEService } from '../PurposeTemplateEditLinkedEService'

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}))

vi.mock('@/router', () => ({
  useParams: vi.fn(() => ({ purposeTemplateId: 'template-123' })),
}))

vi.mock('@/api/purposeTemplate/purposeTemplate.queries', () => ({
  PurposeTemplateQueries: {
    getSingle: vi.fn(),
    getEservicesLinkedToPurposeTemplatesList: vi.fn(() => ({
      queryKey: ['mocked'],
      queryFn: vi.fn(),
    })),
  },
}))

describe('PurposeTemplateEditLinkedEService', () => {
  const mockForward = vi.fn()
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useNavigate as Mock).mockReturnValue(mockNavigate)
    ;(useQuery as Mock).mockImplementation(() => ({ data: undefined })) // ✅ default fallback
  })

  it('renders nothing when purposeTemplate is undefined', () => {
    ;(useQuery as Mock)
      .mockReturnValueOnce({ data: undefined })
      .mockReturnValueOnce({ data: undefined })

    const { container } = render(
      <PurposeTemplateEditLinkedEService forward={mockForward} back={() => {}} activeStep={0} />
    )

    expect(container).toBeEmptyDOMElement()
  })
})

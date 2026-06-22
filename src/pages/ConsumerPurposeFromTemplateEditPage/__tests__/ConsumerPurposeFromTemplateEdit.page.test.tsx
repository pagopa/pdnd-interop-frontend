import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import ConsumerPurposeFromTemplateEditPage from '../ConsumerPurposeFromTemplateEdit.page'
import type { PurposeCreateContextProviderProps } from '@/components/shared/PurposeCreateContext'
import type * as ReactQuery from '@tanstack/react-query'
mockUseJwt()

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useQuery: vi.fn(() => ({ isLoading: false })),
}))

vi.mock('@/components/shared/PurposeCreateContext', () => ({
  PurposeCreateContextProvider: (props: PurposeCreateContextProviderProps) => (
    <div>{props.children}</div>
  ),
}))

vi.mock(
  './../components/PurposeFromTemplateEditStepGeneral/PurposeFromTemplateEditStepGeneral',
  () => ({
    PurposeFromTemplateEditStepGeneral: () => <div>PurposeFromTemplateEditStepGeneral</div>,
  })
)

vi.mock(
  './../components/PurposeFromTemplateEditStepRiskAnalysis/PurposeFromTemplateEditStepRiskAnalysis',
  () => ({
    PurposeFromTemplateEditStepRiskAnalysis: () => (
      <div>PurposeFromTemplateEditStepRiskAnalysis</div>
    ),
  })
)

describe('ConsumerPurposeFromTemplateEditPage', () => {
  it('renders back to list button', () => {
    renderWithApplicationContext(<ConsumerPurposeFromTemplateEditPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('backToListBtn')).toBeInTheDocument()
  })
  it('renders required label', () => {
    renderWithApplicationContext(<ConsumerPurposeFromTemplateEditPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('requiredLabel')).toBeInTheDocument()
  })
})

import { renderWithApplicationContext } from '@/utils/testing.utils'
import { VoucherInstructionsGeneralFormCurrentIdsDrawer } from '../VoucherInstructionsGeneralFormCurrentIdsDrawer'
import { screen } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: vi.fn(() => ({
      queryKey: ['purpose', 'purpose-1'],
      queryFn: async () => ({
        id: 'purpose-1',
        eservice: {
          id: 'eservice-1',
          descriptor: {
            id: 'descriptor-1',
          },
          producer: {
            id: 'producer-1',
          },
        },
        agreement: {
          id: 'agreement-1',
        },
        producer: {
          id: 'producer-1',
        },
        consumer: {
          id: 'consumer-1',
        },
      }),
    })),
  },
}))

describe('VoucherInstructionsGeneralFormCurrentIdsDrawer', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    clientId: 'client-1',
    purposeId: 'purpose-1',
  }

  it('renders title and subtitle', async () => {
    const props = {
      ...defaultProps,
    }

    renderWithApplicationContext(<VoucherInstructionsGeneralFormCurrentIdsDrawer {...props} />, {
      withReactQueryContext: true,
    })

    expect(await screen.findByText('title')).toBeInTheDocument()
    expect(await screen.findByText('subtitle')).toBeInTheDocument()
  })

  it('renders purpose fields when data is present', async () => {
    const props = {
      ...defaultProps,
    }

    renderWithApplicationContext(<VoucherInstructionsGeneralFormCurrentIdsDrawer {...props} />, {
      withReactQueryContext: true,
    })

    expect(await screen.findByText('client-1')).toBeInTheDocument()
    expect(await screen.findByText('purpose-1')).toBeInTheDocument()
    expect(await screen.findByText('agreement-1')).toBeInTheDocument()
    expect(await screen.findByText('producer-1')).toBeInTheDocument()
    expect(await screen.findByText('consumer-1')).toBeInTheDocument()
  })
})

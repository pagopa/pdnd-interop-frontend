import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'

import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'
import { ProviderEServiceDelegatorArchivingAlert } from '../components/ProviderEServiceDelegatorArchivingAlert'

mockUseJwt()

const renderAlerts = (descriptor: ProducerEServiceDescriptor | undefined) =>
  renderWithApplicationContext(
    <ProviderEServiceDelegatorArchivingAlert descriptor={descriptor} />,
    {
      withReactQueryContext: true,
      withRouterContext: true,
    }
  )

describe('ProviderEServiceArchivingAlert', () => {
  it('renders nothing when descriptor is undefined', () => {
    const { container } = renderAlerts(undefined)
    expect(container).toBeEmptyDOMElement()
  })

  it('should not render this alertwhen the descriptor state === PUBLISHED', () => {
    const { container } = renderAlerts(createMockEServiceDescriptorProvider({ state: 'PUBLISHED' }))
    expect(container).toBeEmptyDOMElement()
  })

  it('should render warning alert when a delegated entity create an archiving request for the whole eservice', () => {
    const descriptor = createMockEServiceDescriptorProvider({
      eservice: {
        delegatedArchivingRequest: {
          requestedAt: '2026-12-01T00:00:00.000Z',
          requesterId: 'requester-id',
          gracePeriodDays: 30,
          archivingReason: 'Motivo archiviazione',
        },
      },
    })

    renderAlerts(descriptor)

    expect(screen.getByText('alert.delegatorEServiceArchivingRequest')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass(/MuiAlert-standardWarning/)
  })

  it('should render warning alert when a delegated entity create an archiving request for the eservice version selected by the delegator', () => {
    const descriptor = createMockEServiceDescriptorProvider({
      id: 'descriptor-id-1',
      eservice: {
        delegatedArchivingRequest: {
          requestedAt: '2026-12-01T00:00:00.000Z',
          descriptorId: 'descriptor-id-1',
          requesterId: 'requester-id',
          gracePeriodDays: 30,
          archivingReason: 'Motivo archiviazione',
        },
      },
    })

    renderAlerts(descriptor)

    expect(screen.getByText('alert.delegatorDescriptorArchivingRequest')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass(/MuiAlert-standardWarning/)
  })

  it('should render warning alert when a delegated entity create an archiving request for an obsolete eservice version', () => {
    const descriptor = createMockEServiceDescriptorProvider({
      id: 'descriptor-id-1',
      eservice: {
        delegatedArchivingRequest: {
          requestedAt: '2026-12-01T00:00:00.000Z',
          descriptorId: 'descriptor-id-2',
          requesterId: 'requester-id',
          gracePeriodDays: 30,
          archivingReason: 'Motivo archiviazione',
        },
      },
    })

    renderAlerts(descriptor)

    expect(
      screen.getByText('alert.delegatorDeprecatedDescriptorArchivingRequest')
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass(/MuiAlert-standardWarning/)
  })
})

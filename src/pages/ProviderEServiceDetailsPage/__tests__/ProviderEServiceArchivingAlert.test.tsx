import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'
import { ProviderEServiceArchivingAlert } from '../components/ProviderEServiceArchivingAlert'

const renderAlerts = (
  descriptor: ProducerEServiceDescriptor | undefined,
  onViewKeychains?: VoidFunction
) =>
  renderWithApplicationContext(<ProviderEServiceArchivingAlert descriptor={descriptor} />, {
    withRouterContext: true,
  })

describe('ProviderEServiceArchivingAlert', () => {
  it('renders nothing when descriptor is undefined', () => {
    const { container } = renderAlerts(undefined)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the descriptor state has no matching alert spec (PUBLISHED)', () => {
    const { container } = renderAlerts(createMockEServiceDescriptorProvider({ state: 'PUBLISHED' }))
    expect(container).toBeEmptyDOMElement()
  })

  it('renders delegated archiving request warning alert for EService', () => {
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

  it('renders delegated archiving request warning alert for current Descriptor', () => {
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

  it('renders delegated archiving request warning alert for obsolete Descriptor', () => {
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

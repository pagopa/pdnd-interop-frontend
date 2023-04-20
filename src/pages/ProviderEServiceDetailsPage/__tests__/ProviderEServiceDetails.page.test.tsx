import React from 'react'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  mockUseRouteParams,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import ProviderEServiceDetailsPage from '../ProviderEServiceDetails.page'
import { vi } from 'vitest'
import { EServiceQueries } from '@/api/eservice'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { createMockEServiceDescriptorProvider } from '__mocks__/data/eservice.mocks'

mockUseCurrentRoute({ mode: 'provider' })
mockUseRouteParams({ eserviceId: 'eserviceId', descriptorId: 'descriptorId' })

const mockUseGetDescriptorProvider = (
  descriptor: ProducerEServiceDescriptor | undefined,
  isLoading = false
) => {
  vi.spyOn(EServiceQueries, 'useGetDescriptorProvider').mockReturnValue({
    data: descriptor,
    isLoading,
  } as unknown as ReturnType<typeof EServiceQueries.useGetDescriptorProvider>)
}

describe('ProviderEServiceDetails', () => {
  it('should match the snapshot', () => {
    mockUseGetDescriptorProvider(createMockEServiceDescriptorProvider())
    const { baseElement } = renderWithApplicationContext(<ProviderEServiceDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot in loading state', () => {
    mockUseGetDescriptorProvider(undefined, true)
    const { baseElement } = renderWithApplicationContext(<ProviderEServiceDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should render an alert when there is a draft descriptor and user is an admin', () => {
    mockUseJwt({ isAdmin: true })
    mockUseGetDescriptorProvider(
      createMockEServiceDescriptorProvider({
        eservice: {
          draftDescriptor: {
            id: 'draftDescriptorId',
          },
        },
      })
    )
    const screen = renderWithApplicationContext(<ProviderEServiceDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.baseElement).toHaveTextContent('read.alert.hasNewVersionDraft')
  })

  it('should not render an alert when there is not a draft descriptor and user is an admin', () => {
    mockUseJwt({ isAdmin: true })
    mockUseGetDescriptorProvider(
      createMockEServiceDescriptorProvider({
        eservice: {
          draftDescriptor: undefined,
        },
      })
    )
    const screen = renderWithApplicationContext(<ProviderEServiceDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.baseElement).not.toHaveTextContent('read.alert.hasNewVersionDraft')
  })

  it('should not render an alert when there is a draft descriptor and user is not an admin', () => {
    mockUseJwt({ isAdmin: false })
    mockUseGetDescriptorProvider(
      createMockEServiceDescriptorProvider({
        eservice: {
          draftDescriptor: {
            id: 'draftDescriptorId',
          },
        },
      })
    )
    const screen = renderWithApplicationContext(<ProviderEServiceDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.baseElement).not.toHaveTextContent('read.alert.hasNewVersionDraft')
  })
})

import React from 'react'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  mockUseRouteParams,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import ConsumerEServiceDetailsPage, {
  ConsumerEServiceDetailsPageContentSkeleton,
} from '../ConsumerEServiceDetails.page'
import { vi } from 'vitest'
import { EServiceQueries } from '@/api/eservice'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { createMockEServiceDescriptorCatalog } from '__mocks__/data/eservice.mocks'

mockUseCurrentRoute({ mode: 'provider' })
mockUseRouteParams({ eserviceId: 'eserviceId', descriptorId: 'descriptorId' })

const mockUseGetDescriptorCatalog = (descriptor: CatalogEServiceDescriptor | undefined) => {
  vi.spyOn(EServiceQueries, 'useGetDescriptorCatalog').mockReturnValue({
    data: descriptor,
  } as unknown as ReturnType<typeof EServiceQueries.useGetDescriptorCatalog>)
}

describe('ConsumerEServiceDetails', () => {
  it('should match the snapshot in loading state', () => {
    mockUseJwt()
    const { baseElement } = renderWithApplicationContext(<ConsumerEServiceDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot', () => {
    mockUseGetDescriptorCatalog(createMockEServiceDescriptorCatalog())
    const { baseElement } = renderWithApplicationContext(<ConsumerEServiceDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot when descriptor is undefined', () => {
    mockUseGetDescriptorCatalog(undefined)
    const { baseElement } = renderWithApplicationContext(<ConsumerEServiceDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should render an alert if the e-service is owned by the active user', () => {
    mockUseGetDescriptorCatalog(createMockEServiceDescriptorCatalog({ eservice: { isMine: true } }))
    const screen = renderWithApplicationContext(<ConsumerEServiceDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('read.alert.youAreTheProvider')).toBeInTheDocument()
  })

  it('should render an alert if the user has not all the certifed attributes needed to subscribe', () => {
    mockUseGetDescriptorCatalog(
      createMockEServiceDescriptorCatalog({
        eservice: { isMine: false, hasCertifiedAttributes: false },
      })
    )
    const screen = renderWithApplicationContext(<ConsumerEServiceDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('read.alert.missingCertifiedAttributes')).toBeInTheDocument()
  })

  it('should render an alert if the user is already subscribed', () => {
    mockUseGetDescriptorCatalog(
      createMockEServiceDescriptorCatalog({
        eservice: { agreement: { id: 'id', state: 'ACTIVE' } },
      })
    )
    const screen = renderWithApplicationContext(<ConsumerEServiceDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('read.alert.alreadySubscribed')).toBeInTheDocument()
  })

  it('should render an alert if the user is has already an agreement in DRAFT state', () => {
    mockUseGetDescriptorCatalog(
      createMockEServiceDescriptorCatalog({
        eservice: { agreement: { id: 'id', state: 'DRAFT' } },
      })
    )
    const screen = renderWithApplicationContext(<ConsumerEServiceDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('read.alert.hasAgreementDraft')).toBeInTheDocument()
  })
})

describe('ConsumerEServiceDetailsPageContentSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(
      <ConsumerEServiceDetailsPageContentSkeleton />,
      { withRouterContext: true }
    )
    expect(baseElement).toMatchSnapshot()
  })
})

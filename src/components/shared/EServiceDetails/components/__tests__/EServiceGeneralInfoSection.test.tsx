import React from 'react'
import { EServiceGeneralInfoSection } from '../EServiceGeneralInfoSection'
import { mockEServiceDetailsContext } from './test.commons'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceDescriptorCatalog } from '__mocks__/data/eservice.mocks'

describe('EServiceGeneralInfoSection', () => {
  it('should match the snapshot (admin)', () => {
    mockEServiceDetailsContext({
      descriptor: createMockEServiceDescriptorCatalog(),
      agreement: { id: 'agreement-id', state: 'DRAFT' },
    })
    mockUseJwt({ isAdmin: true })
    const { baseElement } = renderWithApplicationContext(<EServiceGeneralInfoSection />, {
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (not admin)', () => {
    mockEServiceDetailsContext({
      descriptor: createMockEServiceDescriptorCatalog(),
      agreement: { id: 'agreement-id', state: 'ACTIVE' },
    })
    mockUseJwt({ isAdmin: true })
    const { baseElement } = renderWithApplicationContext(<EServiceGeneralInfoSection />, {
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should not render if the descriptor is falsy', () => {
    mockEServiceDetailsContext({
      descriptor: undefined,
      agreement: { id: 'agreement-id', state: 'ACTIVE' },
    })
    mockUseJwt({ isAdmin: true })
    const { container } = renderWithApplicationContext(<EServiceGeneralInfoSection />, {
      withRouterContext: true,
    })
    expect(container).toBeEmptyDOMElement()
  })
})

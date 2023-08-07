import React from 'react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceVersionInfoSection } from '../EServiceVersionInfoSection'
import { mockEServiceDetailsContext } from './test.commons'
import { createMockEServiceDescriptorCatalog } from '@/../__mocks__/data/eservice.mocks'

describe('EServiceVersionInfoSection', () => {
  it('should match the snapshot', () => {
    mockEServiceDetailsContext({
      descriptor: createMockEServiceDescriptorCatalog(),
      isViewingDescriptorCurrentVersion: false,
    })
    const { baseElement } = renderWithApplicationContext(<EServiceVersionInfoSection />, {
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot when viewing descriptor is the current version', () => {
    mockEServiceDetailsContext({
      descriptor: createMockEServiceDescriptorCatalog(),
      isViewingDescriptorCurrentVersion: true,
    })
    const { baseElement } = renderWithApplicationContext(<EServiceVersionInfoSection />, {
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should not render when descriptor is falsy', () => {
    mockEServiceDetailsContext({
      descriptor: undefined,
      isViewingDescriptorCurrentVersion: true,
    })
    const { container } = renderWithApplicationContext(<EServiceVersionInfoSection />, {
      withRouterContext: true,
    })
    expect(container).toBeEmptyDOMElement()
  })
})

import React from 'react'
import { createMockDescriptorAttribute } from '@/../__mocks__/data/attribute.mocks'
import { mockEServiceDetailsContext } from './test.commons'
import { EServiceDescriptorAttributesSections } from '../EServiceDescriptorAttributesSections'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type { DescriptorAttributes } from '@/api/api.generatedTypes'
import { createMockEServiceDescriptorCatalog } from '@/../__mocks__/data/eservice.mocks'

const descriptorAttributes: DescriptorAttributes = {
  certified: [
    [
      createMockDescriptorAttribute({
        id: 'certified-group-1-1',
        explicitAttributeVerification: false,
      }),
      createMockDescriptorAttribute({
        id: 'certified-group-1-2',
        explicitAttributeVerification: false,
      }),
      createMockDescriptorAttribute({
        id: 'certified-group-1-3',
        explicitAttributeVerification: false,
      }),
    ],
    [
      createMockDescriptorAttribute({
        id: 'certified-group-2-1',
        explicitAttributeVerification: false,
      }),
    ],
  ],
  verified: [
    [
      createMockDescriptorAttribute({
        id: 'certified-group-1-1',
        explicitAttributeVerification: false,
      }),
      createMockDescriptorAttribute({
        id: 'certified-group-1-2',
        explicitAttributeVerification: false,
      }),
      createMockDescriptorAttribute({
        id: 'certified-group-1-3',
        explicitAttributeVerification: false,
      }),
    ],
    [
      createMockDescriptorAttribute({
        id: 'certified-group-2-1',
        explicitAttributeVerification: false,
      }),
    ],
  ],
  declared: [
    [
      createMockDescriptorAttribute({
        id: 'certified-group-1-1',
        explicitAttributeVerification: false,
      }),
      createMockDescriptorAttribute({
        id: 'certified-group-1-2',
        explicitAttributeVerification: false,
      }),
      createMockDescriptorAttribute({
        id: 'certified-group-1-3',
        explicitAttributeVerification: false,
      }),
    ],
    [
      createMockDescriptorAttribute({
        id: 'certified-group-2-1',
        explicitAttributeVerification: false,
      }),
    ],
  ],
}

const descriptor = createMockEServiceDescriptorCatalog({ attributes: descriptorAttributes })

describe('EServiceDescriptorAttributesSections', () => {
  it('should match the snapshot', () => {
    mockEServiceDetailsContext({ descriptor })
    const { baseElement } = renderWithApplicationContext(<EServiceDescriptorAttributesSections />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot on no attributes', () => {
    mockEServiceDetailsContext({
      descriptor: createMockEServiceDescriptorCatalog({
        attributes: { certified: [], verified: [], declared: [] },
      }),
    })
    const { baseElement } = renderWithApplicationContext(<EServiceDescriptorAttributesSections />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})

import React from 'react'
import type { RemappedDescriptorAttributes } from '@/types/attribute.types'
import { createMockAttribute } from '__mocks__/data/attribute.mocks'
import { mockEServiceDetailsContext } from './test.commons'
import { EServiceAttributesSections } from '../EServiceAttributesSections'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const descriptorAttributes: RemappedDescriptorAttributes = {
  certified: [
    {
      attributes: [
        createMockAttribute({ id: 'certified-group-1-1', kind: 'CERTIFIED' }),
        createMockAttribute({ id: 'certified-group-1-2', kind: 'CERTIFIED' }),
        createMockAttribute({ id: 'certified-group-1-3', kind: 'CERTIFIED' }),
      ],
      explicitAttributeVerification: false,
    },
    {
      attributes: [createMockAttribute({ id: 'certified-group-2-1', kind: 'CERTIFIED' })],
      explicitAttributeVerification: false,
    },
  ],
  verified: [
    {
      attributes: [
        createMockAttribute({ id: 'verified-group-1-1', kind: 'VERIFIED' }),
        createMockAttribute({ id: 'verified-group-1-2', kind: 'VERIFIED' }),
        createMockAttribute({ id: 'verified-group-1-3', kind: 'VERIFIED' }),
      ],
      explicitAttributeVerification: false,
    },
    {
      attributes: [createMockAttribute({ id: 'verified-group-2-1', kind: 'VERIFIED' })],
      explicitAttributeVerification: false,
    },
  ],
  declared: [
    {
      attributes: [
        createMockAttribute({ id: 'declared-group-1-1', kind: 'DECLARED' }),
        createMockAttribute({ id: 'declared-group-1-2', kind: 'DECLARED' }),
        createMockAttribute({ id: 'declared-group-1-3', kind: 'DECLARED' }),
      ],
      explicitAttributeVerification: false,
    },
    {
      attributes: [createMockAttribute({ id: 'declared-group-2-1', kind: 'DECLARED' })],
      explicitAttributeVerification: false,
    },
  ],
}

describe('EServiceAttributesSections', () => {
  it('should match the snapshot', () => {
    mockEServiceDetailsContext({ descriptorAttributes })
    const { baseElement } = renderWithApplicationContext(<EServiceAttributesSections />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot on no attributes', () => {
    mockEServiceDetailsContext({
      descriptorAttributes: { certified: [], verified: [], declared: [] },
    })
    const { baseElement } = renderWithApplicationContext(<EServiceAttributesSections />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})

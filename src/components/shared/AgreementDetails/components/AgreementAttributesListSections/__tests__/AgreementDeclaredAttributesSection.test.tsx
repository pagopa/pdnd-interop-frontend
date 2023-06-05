import React from 'react'
import { mockUseCurrentRoute, renderWithApplicationContext } from '@/utils/testing.utils'
import { mockAgreementDetailsContext } from '../../__tests__/test.commons'
import { AgreementDeclaredAttributesSection } from '../AgreementDeclaredAttributesSection'
import {
  createDeclaredTenantAttribute,
  createMockRemappedEServiceAttribute,
} from '__mocks__/data/attribute.mocks'

mockUseCurrentRoute({ mode: 'provider' })

describe('AgreementDeclaredAttributesSection', () => {
  it('should match snapshot when e-service does not require declared attributes', () => {
    mockAgreementDetailsContext({
      eserviceAttributes: undefined,
    })
    const { baseElement } = renderWithApplicationContext(<AgreementDeclaredAttributesSection />, {
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot when e-service requires declared attributes', () => {
    mockAgreementDetailsContext({
      eserviceAttributes: {
        certified: [],
        verified: [],
        declared: [
          createMockRemappedEServiceAttribute({ attributes: [{ id: 'a-1-1' }, { id: 'a-1-2' }] }),
          createMockRemappedEServiceAttribute({ attributes: [{ id: 'a-2-1' }, { id: 'a-2-2' }] }),
        ],
      },
      partyAttributes: {
        certified: [],
        verified: [],
        declared: [createDeclaredTenantAttribute({ id: 'a-1-1', revocationTimestamp: undefined })],
      },
    })
    const { baseElement } = renderWithApplicationContext(<AgreementDeclaredAttributesSection />, {
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})

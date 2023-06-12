import React from 'react'
import { mockUseCurrentRoute, renderWithApplicationContext } from '@/utils/testing.utils'
import { mockAgreementDetailsContext } from '../../__tests__/test.commons'
import { AgreementVerifiedAttributesSection } from '../AgreementVerifiedAttributesSection'
import {
  createVerifiedTenantAttribute,
  createMockRemappedEServiceAttribute,
} from '__mocks__/data/attribute.mocks'

mockUseCurrentRoute({ mode: 'provider' })

describe('AgreementVerifiedAttributesSection', () => {
  it('should match snapshot when e-service does not require verified attributes', () => {
    mockAgreementDetailsContext({
      eserviceAttributes: undefined,
    })
    const { baseElement } = renderWithApplicationContext(<AgreementVerifiedAttributesSection />, {
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot when e-service requires verified attributes', () => {
    mockAgreementDetailsContext({
      eserviceAttributes: {
        certified: [],
        verified: [
          createMockRemappedEServiceAttribute({ attributes: [{ id: 'a-1-1' }, { id: 'a-1-2' }] }),
          createMockRemappedEServiceAttribute({ attributes: [{ id: 'a-2-1' }, { id: 'a-2-2' }] }),
        ],
        declared: [],
      },
      partyAttributes: {
        certified: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'a-1-1',
            revokedBy: [],
            verifiedBy: [{ id: 'test' }],
          }),
        ],
        declared: [],
      },
    })
    const { baseElement } = renderWithApplicationContext(<AgreementVerifiedAttributesSection />, {
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should show revoked chip when attribute is revoked and user is consumer', () => {
    mockUseCurrentRoute({ mode: 'consumer' })
    mockAgreementDetailsContext({
      eserviceAttributes: {
        certified: [],
        verified: [createMockRemappedEServiceAttribute({ attributes: [{ id: 'a-1-1' }] })],
        declared: [],
      },
      partyAttributes: {
        certified: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'a-1-1',
            revokedBy: [{ id: 'test' }],
            verifiedBy: [],
          }),
        ],
        declared: [],
      },
    })

    const screen = renderWithApplicationContext(<AgreementVerifiedAttributesSection />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText('group.manage.revokedByProducer')).toBeInTheDocument()
  })
})

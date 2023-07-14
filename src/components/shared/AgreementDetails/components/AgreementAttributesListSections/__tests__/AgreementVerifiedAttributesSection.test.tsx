import React from 'react'
import { mockUseCurrentRoute, renderWithApplicationContext } from '@/utils/testing.utils'
import { mockAgreementDetailsContext } from '../../__tests__/test.commons'
import { AgreementVerifiedAttributesSection } from '../AgreementVerifiedAttributesSection'
import {
  createVerifiedTenantAttribute,
  createMockRemappedDescriptorAttribute,
} from '__mocks__/data/attribute.mocks'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import { vi } from 'vitest'

mockUseCurrentRoute({ mode: 'provider' })

describe('AgreementVerifiedAttributesSection', () => {
  it('should match snapshot when e-service does not require verified attributes', () => {
    mockAgreementDetailsContext({
      descriptorAttributes: undefined,
    })
    const { baseElement } = renderWithApplicationContext(<AgreementVerifiedAttributesSection />, {
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot when e-service requires verified attributes', () => {
    mockAgreementDetailsContext({
      descriptorAttributes: {
        certified: [],
        verified: [
          createMockRemappedDescriptorAttribute({ attributes: [{ id: 'a-1-1' }, { id: 'a-1-2' }] }),
          createMockRemappedDescriptorAttribute({ attributes: [{ id: 'a-2-1' }, { id: 'a-2-2' }] }),
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
      descriptorAttributes: {
        certified: [],
        verified: [createMockRemappedDescriptorAttribute({ attributes: [{ id: 'a-1-1' }] })],
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

  it('should match snapshot when agreement and agreementVerifiedAttributeDrawerProps are defined', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
      agreementVerifiedAttributeDrawerProps: {
        isOpen: true,
        attributeId: 'test attributeId',
        type: 'revoke',
      },
      setAgreementVerifiedAttributeDrawerProps: vi.fn(),
    })
    const { baseElement } = renderWithApplicationContext(<AgreementVerifiedAttributesSection />, {
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should show expirationDate chip when attribute is verified and has an expirationDate', () => {
    mockUseCurrentRoute({ mode: 'consumer' })
    mockAgreementDetailsContext({
      descriptorAttributes: {
        certified: [],
        verified: [createMockRemappedDescriptorAttribute({ attributes: [{ id: 'a-1-1' }] })],
        declared: [],
      },
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'a-1-1',
            verifiedBy: [
              {
                id: 'test-id-producer',
                verificationDate: '2023-02-15T09:33:35.000Z',
                expirationDate: '2023-02-20T09:33:35.000Z',
              },
            ],
          }),
        ],
      },
    })

    const screen = renderWithApplicationContext(<AgreementVerifiedAttributesSection />, {
      withReactQueryContext: true,
    })

    screen.debug()

    expect(screen.getByText('group.manage.expirationDate')).toBeInTheDocument()
  })
})

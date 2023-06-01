import React from 'react'
import { mockUseCurrentRoute, renderWithApplicationContext } from '@/utils/testing.utils'
import { mockAgreementDetailsContext } from '../../__tests__/test.commons'
import { render } from '@testing-library/react'
import { AgreementCertifiedAttributesSection } from '../AgreementCertifiedAttributesSection'
import {
  createCertifiedTenantAttribute,
  createMockRemappedEServiceAttribute,
} from '__mocks__/data/attribute.mocks'

mockUseCurrentRoute({ mode: 'provider' })

describe('AgreementCertifiedAttributesSection', () => {
  it('should match snapshot when e-service does not require certified attributes', () => {
    mockAgreementDetailsContext({
      eserviceAttributes: undefined,
    })
    const { baseElement } = render(<AgreementCertifiedAttributesSection />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot when e-service requires certified attributes', () => {
    mockAgreementDetailsContext({
      eserviceAttributes: {
        certified: [
          createMockRemappedEServiceAttribute({ attributes: [{ id: 'a-1-1' }, { id: 'a-1-2' }] }),
          createMockRemappedEServiceAttribute({ attributes: [{ id: 'a-2-1' }, { id: 'a-2-2' }] }),
        ],
        verified: [],
        declared: [],
      },
      partyAttributes: {
        certified: [
          createCertifiedTenantAttribute({ id: 'a-1-1', revocationTimestamp: undefined }),
        ],
        verified: [],
        declared: [],
      },
    })
    const { baseElement } = renderWithApplicationContext(<AgreementCertifiedAttributesSection />, {
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})

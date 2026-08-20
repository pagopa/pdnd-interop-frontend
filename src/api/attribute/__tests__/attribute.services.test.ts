import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import { AttributeServices } from '../attribute.services'

vi.mock('@/config/axios', () => ({
  default: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('AttributeServices', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should pass the producer delegation when verifying an attribute', async () => {
    await AttributeServices.verifyPartyAttribute({
      partyId: 'consumer-id',
      id: 'attribute-id',
      agreementId: 'agreement-id',
      delegationId: 'delegation-id',
    })

    expect(axiosInstance.post).toHaveBeenCalledWith(
      `${BACKEND_FOR_FRONTEND_URL}/tenants/consumer-id/attributes/verified`,
      {
        id: 'attribute-id',
        agreementId: 'agreement-id',
        delegationId: 'delegation-id',
      }
    )
  })

  it('should pass the producer delegation when revoking an attribute', async () => {
    await AttributeServices.revokeVerifiedPartyAttribute({
      partyId: 'consumer-id',
      attributeId: 'attribute-id',
      agreementId: 'agreement-id',
      delegationId: 'delegation-id',
    })

    expect(axiosInstance.delete).toHaveBeenCalledWith(
      `${BACKEND_FOR_FRONTEND_URL}/tenants/consumer-id/attributes/verified/attribute-id`,
      {
        data: {
          agreementId: 'agreement-id',
          delegationId: 'delegation-id',
        },
      }
    )
  })
})

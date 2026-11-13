import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AttributeServices } from '../attribute.services'

vi.mock('@/config/axios', () => ({
  default: {
    delete: vi.fn().mockResolvedValue({ data: {} }),
  },
}))

describe('AttributeServices', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('revokeVerifiedPartyAttribute', () => {
    it('sends the agreement id as a query parameter without a request body', async () => {
      const partyId: string = 'party-id'
      const attributeId: string = 'attribute-id'
      const agreementId: string = 'agreement-id'

      await AttributeServices.revokeVerifiedPartyAttribute({ partyId, attributeId, agreementId })

      expect(axiosInstance.delete).toHaveBeenCalledWith(
        `${BACKEND_FOR_FRONTEND_URL}/tenants/${partyId}/attributes/verified/${attributeId}`,
        { params: { agreementId } }
      )
    })
  })
})

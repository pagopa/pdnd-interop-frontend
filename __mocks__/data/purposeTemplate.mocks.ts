import type { PurposeTemplateWithCompactCreator } from '../../src/api/api.generatedTypes'
import { createMockFactory } from '../../src/utils/testing.utils'

export const mockPurposeTemplateResponse: PurposeTemplateWithCompactCreator = {
  id: 'test-purpose-template-id',
  purposeTitle: 'Test Purpose Template',
  purposeDescription: 'This is a test purpose template description.',
  creator: {
    id: 'creator-id',
    name: 'Creator Name',
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
  targetTenantKind: 'PA',
  targetDescription: 'Intended for public administrations.',
  purposeIsFreeOfCharge: true,
  purposeDailyCalls: 12,
  handlesPersonalData: true,
  state: 'PUBLISHED',
}

const createMockPurposeTemplate = createMockFactory<PurposeTemplateWithCompactCreator>({
  ...mockPurposeTemplateResponse,
})

export { createMockPurposeTemplate }

import type { PrivacyNotice } from './../../src/api/api.generatedTypes'
import { createMockFactory } from '../../src/utils/testing.utils'

const createMockPrivacyNotice = createMockFactory<PrivacyNotice>({
  id: 'id',
  userId: 'userId',
  consentType: 'PP',
  firstAccept: false,
  isUpdated: false,
  latestVersionId: 'latestVersionId',
})

export { createMockPrivacyNotice }

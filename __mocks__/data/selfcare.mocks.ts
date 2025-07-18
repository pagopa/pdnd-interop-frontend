import { createMockFactory } from '../../src/utils/testing.utils'
import type { SelfcareInstitution } from '../../src/api/api.generatedTypes'
import type { ProductSwitchItem } from '@pagopa/mui-italia'
import type { PartySwitchItem } from '@pagopa/mui-italia/dist/components/PartySwitch'

const createMockSelfcareInsitution = createMockFactory<SelfcareInstitution>({
  id: 'test-id',
  description: 'test-description',
  parent: 'test-parent',
  userProductRoles: ['admin'],
})

const createMockProductSwitchItem = createMockFactory<ProductSwitchItem>({
  id: 'test-id',
  title: 'test-title',
  productUrl: '',
  linkType: 'internal',
})

const createMockPartySwitchItem = createMockFactory<PartySwitchItem>({
  id: 'test-id',
  name: 'test-name',
  productRole: 'admin',
  parentName: 'test-parent',
})

export { createMockSelfcareInsitution, createMockProductSwitchItem, createMockPartySwitchItem }

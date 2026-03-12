import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { ReadOnlyDescriptorAttributes } from '../ReadOnlyDescriptorAttributes'
import type { AttributeOwnershipData } from '../ReadOnlyDescriptorAttributes'
import type { DescriptorAttributes } from '@/api/api.generatedTypes'
import { mockUseCurrentRoute, renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createCertifiedTenantAttribute,
  createDeclaredTenantAttribute,
  createVerifiedTenantAttribute,
  createMockDescriptorAttribute,
} from '@/../__mocks__/data/attribute.mocks'

mockUseCurrentRoute({ mode: 'consumer' })

vi.mock('../CustomizeThresholdDrawer', () => ({
  useCustomizeThresholdDrawer: () => ({ open: vi.fn() }),
}))

const PRODUCER_ID = 'producer-id'

function createDescriptorAttributes(
  overrides?: Partial<DescriptorAttributes>
): DescriptorAttributes {
  return {
    certified: [],
    verified: [],
    declared: [],
    ...overrides,
  }
}

function createOwnershipData(overrides?: Partial<AttributeOwnershipData>): AttributeOwnershipData {
  return {
    certified: [],
    verified: [],
    declared: [],
    producerId: PRODUCER_ID,
    ...overrides,
  }
}

function renderComponent(
  descriptorAttributes: DescriptorAttributes,
  ownershipData?: AttributeOwnershipData
) {
  return renderWithApplicationContext(
    <ReadOnlyDescriptorAttributes
      descriptorAttributes={descriptorAttributes}
      ownershipData={ownershipData}
    />,
    {
      withReactQueryContext: true,
      withRouterContext: true,
    }
  )
}

describe('ReadOnlyDescriptorAttributes', () => {
  describe('color assignment', () => {
    it('should show error (red) for unfulfilled certified attributes', () => {
      const descriptorAttributes = createDescriptorAttributes({
        certified: [[createMockDescriptorAttribute({ id: 'attr-1' })]],
      })
      const ownershipData = createOwnershipData({
        certified: [],
      })

      renderComponent(descriptorAttributes, ownershipData)

      expect(screen.getByText('group.manage.error.consumer')).toBeInTheDocument()
    })

    it('should show warning (yellow) for unfulfilled verified attributes', () => {
      const descriptorAttributes = createDescriptorAttributes({
        verified: [[createMockDescriptorAttribute({ id: 'attr-1' })]],
      })
      const ownershipData = createOwnershipData({
        verified: [],
      })

      renderComponent(descriptorAttributes, ownershipData)

      expect(screen.getByText('group.manage.warning.verified.consumer')).toBeInTheDocument()
    })

    it('should show warning (yellow) for unfulfilled declared attributes', () => {
      const descriptorAttributes = createDescriptorAttributes({
        declared: [[createMockDescriptorAttribute({ id: 'attr-1' })]],
      })
      const ownershipData = createOwnershipData({
        declared: [],
      })

      renderComponent(descriptorAttributes, ownershipData)

      expect(screen.getByText('group.manage.warning.declared.consumer')).toBeInTheDocument()
    })

    it('should show success (green) for fulfilled attributes', () => {
      const descriptorAttributes = createDescriptorAttributes({
        certified: [[createMockDescriptorAttribute({ id: 'attr-1' })]],
      })
      const ownershipData = createOwnershipData({
        certified: [
          createCertifiedTenantAttribute({ id: 'attr-1', revocationTimestamp: undefined }),
        ],
      })

      renderComponent(descriptorAttributes, ownershipData)

      expect(screen.getByText('group.manage.success.consumer')).toBeInTheDocument()
    })
  })

  describe('fulfillment status hidden when there is a blocking attribute', () => {
    it('should hide fulfillment status for non-blocking groups when a certified group is unfulfilled', () => {
      const descriptorAttributes = createDescriptorAttributes({
        certified: [[createMockDescriptorAttribute({ id: 'cert-attr-1' })]],
        verified: [[createMockDescriptorAttribute({ id: 'ver-attr-1' })]],
        declared: [[createMockDescriptorAttribute({ id: 'decl-attr-1' })]],
      })
      const ownershipData = createOwnershipData({
        certified: [], // unfulfilled → error (blocking)
        verified: [
          createVerifiedTenantAttribute({
            id: 'ver-attr-1',
            verifiedBy: [{ id: PRODUCER_ID }],
          }),
        ],
        declared: [
          createDeclaredTenantAttribute({ id: 'decl-attr-1', revocationTimestamp: undefined }),
        ],
      })

      renderComponent(descriptorAttributes, ownershipData)

      // The certified group should still show the error text
      expect(screen.getByText('group.manage.error.consumer')).toBeInTheDocument()

      // Verified and declared groups should hide fulfillment status (showing read mode text instead of success)
      const readModeTexts = screen.getAllByText('consumer')
      expect(readModeTexts.length).toBe(2) // verified + declared suppressed to read mode

      // Success text should NOT appear (verified is fulfilled but hidden due to blocking attribute)
      expect(screen.queryByText('group.manage.success.consumer')).not.toBeInTheDocument()
    })

    it('should show fulfillment status when all certified groups are fulfilled', () => {
      const descriptorAttributes = createDescriptorAttributes({
        certified: [[createMockDescriptorAttribute({ id: 'cert-attr-1' })]],
        verified: [[createMockDescriptorAttribute({ id: 'ver-attr-1' })]],
      })
      const ownershipData = createOwnershipData({
        certified: [
          createCertifiedTenantAttribute({ id: 'cert-attr-1', revocationTimestamp: undefined }),
        ],
        verified: [
          createVerifiedTenantAttribute({
            id: 'ver-attr-1',
            verifiedBy: [{ id: PRODUCER_ID }],
          }),
        ],
      })

      renderComponent(descriptorAttributes, ownershipData)

      // Both groups should show success
      const successTexts = screen.getAllByText('group.manage.success.consumer')
      expect(successTexts.length).toBe(2)
    })

    it('should hide checkmarks for non-blocking groups when there is a blocking attribute', () => {
      const descriptorAttributes = createDescriptorAttributes({
        certified: [[createMockDescriptorAttribute({ id: 'cert-attr-1' })]],
        verified: [[createMockDescriptorAttribute({ id: 'ver-attr-1' })]],
      })
      const ownershipData = createOwnershipData({
        certified: [], // unfulfilled → blocking attribute
        verified: [
          createVerifiedTenantAttribute({
            id: 'ver-attr-1',
            verifiedBy: [{ id: PRODUCER_ID }],
          }),
        ],
      })

      renderComponent(descriptorAttributes, ownershipData)

      // The verified attribute is owned but its fulfillment status is hidden,
      // so no checkmark should be rendered for it
      const checkIcons = screen.queryAllByTestId('CheckIcon')
      expect(checkIcons.length).toBe(0)
    })
  })

  describe('verified attributes can never be red', () => {
    it('should show warning, not error, for unfulfilled verified attributes', () => {
      const descriptorAttributes = createDescriptorAttributes({
        verified: [[createMockDescriptorAttribute({ id: 'attr-1' })]],
      })
      const ownershipData = createOwnershipData({
        verified: [],
      })

      renderComponent(descriptorAttributes, ownershipData)

      expect(screen.getByText('group.manage.warning.verified.consumer')).toBeInTheDocument()
      expect(screen.queryByText('group.manage.error.consumer')).not.toBeInTheDocument()
    })
  })

  describe('declared attributes can never be red', () => {
    it('should show warning, not error, for unfulfilled declared attributes', () => {
      const descriptorAttributes = createDescriptorAttributes({
        declared: [[createMockDescriptorAttribute({ id: 'attr-1' })]],
      })
      const ownershipData = createOwnershipData({
        declared: [],
      })

      renderComponent(descriptorAttributes, ownershipData)

      expect(screen.getByText('group.manage.warning.declared.consumer')).toBeInTheDocument()
      expect(screen.queryByText('group.manage.error.consumer')).not.toBeInTheDocument()
    })
  })
})

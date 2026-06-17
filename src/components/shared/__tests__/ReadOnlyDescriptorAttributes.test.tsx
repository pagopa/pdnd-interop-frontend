import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReadOnlyDescriptorAttributes } from '../ReadOnlyDescriptorAttributes'
import type { AttributeOwnershipData } from '../ReadOnlyDescriptorAttributes'
import type { DescriptorAttributes } from '@/api/api.generatedTypes'
import { mockUseCurrentRoute, renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createStandardCertifiedTenantAttribute,
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

const emptyAttributes: DescriptorAttributes = {
  certified: [],
  verified: [],
  declared: [],
}

describe('ReadOnlyDescriptorAttributes', () => {
  it('should show a single generic banner when there are no attributes', () => {
    render(<ReadOnlyDescriptorAttributes descriptorAttributes={emptyAttributes} />)

    expect(screen.getByText('attributesGenericLabel')).toBeInTheDocument()
    expect(screen.getByText('noAttributesRequiredGenericAlert')).toBeInTheDocument()
  })

  it('should not show the three attribute sections when there are no attributes', () => {
    render(<ReadOnlyDescriptorAttributes descriptorAttributes={emptyAttributes} />)

    expect(screen.queryByText('certified.label')).not.toBeInTheDocument()
    expect(screen.queryByText('verified.label')).not.toBeInTheDocument()
    expect(screen.queryByText('declared.label')).not.toBeInTheDocument()
  })

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
        verified: [[createMockDescriptorAttribute({ id: 'attr-1', kind: 'VERIFIED' })]],
      })
      const ownershipData = createOwnershipData({
        verified: [],
      })

      renderComponent(descriptorAttributes, ownershipData)

      expect(screen.getByText('group.manage.warning.verified.consumer')).toBeInTheDocument()
    })

    it('should show warning (yellow) for unfulfilled declared attributes', () => {
      const descriptorAttributes = createDescriptorAttributes({
        declared: [[createMockDescriptorAttribute({ id: 'attr-1', kind: 'DECLARED' })]],
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
          createStandardCertifiedTenantAttribute({ id: 'attr-1', revocationTimestamp: undefined }),
        ],
      })

      renderComponent(descriptorAttributes, ownershipData)

      expect(screen.getByText('group.manage.success.consumer')).toBeInTheDocument()
    })
  })

  describe('fulfillment status color hidden and text visible when there is a blocking attribute', () => {
    it('should hide fulfillment status color but not text for non-blocking groups when a certified group is unfulfilled', () => {
      const descriptorAttributes = createDescriptorAttributes({
        certified: [[createMockDescriptorAttribute({ id: 'cert-attr-1' })]],
        verified: [[createMockDescriptorAttribute({ id: 'ver-attr-1', kind: 'VERIFIED' })]],
        declared: [[createMockDescriptorAttribute({ id: 'decl-attr-1', kind: 'DECLARED' })]],
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

      // Success text should appear (verified and declared are fulfilled and only color is hidden due to blocking attribute)
      expect(screen.queryAllByText('group.manage.success.consumer').length).toBe(2)
    })

    it('should show fulfillment status when all certified groups are fulfilled', () => {
      const descriptorAttributes = createDescriptorAttributes({
        certified: [[createMockDescriptorAttribute({ id: 'cert-attr-1' })]],
        verified: [[createMockDescriptorAttribute({ id: 'ver-attr-1', kind: 'VERIFIED' })]],
      })
      const ownershipData = createOwnershipData({
        certified: [
          createStandardCertifiedTenantAttribute({
            id: 'cert-attr-1',
            revocationTimestamp: undefined,
          }),
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
        verified: [[createMockDescriptorAttribute({ id: 'ver-attr-1', kind: 'VERIFIED' })]],
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
        verified: [[createMockDescriptorAttribute({ id: 'attr-1', kind: 'VERIFIED' })]],
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
        declared: [[createMockDescriptorAttribute({ id: 'attr-1', kind: 'DECLARED' })]],
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

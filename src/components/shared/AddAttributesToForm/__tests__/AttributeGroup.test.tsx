import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { AttributeGroup } from '../AttributeGroup'
import { vi, describe, it, expect } from 'vitest'
import { renderWithApplicationContext, ReactHookFormWrapper } from '@/utils/testing.utils'
import { createMockDescriptorAttribute } from '@/../__mocks__/data/attribute.mocks'
import type { DescriptorAttribute } from '@/api/api.generatedTypes'

vi.mock('@/components/layout/containers', () => ({
  AttributeContainer: ({
    attribute,
    onRemove,
  }: {
    attribute: DescriptorAttribute
    onRemove?: (id: string, name: string) => void
  }) => (
    <div data-testid={`attribute-container-${attribute.id}`}>
      {attribute.name}
      {onRemove && (
        <button
          data-testid={`remove-${attribute.id}`}
          onClick={() => onRemove(attribute.id, attribute.name)}
        >
          remove
        </button>
      )}
    </div>
  ),
  AttributeGroupContainer: ({
    title,
    children,
    onRemove,
  }: {
    title: string
    children: React.ReactNode
    onRemove?: VoidFunction
  }) => (
    <div data-testid="attribute-group-container">
      <span>{title}</span>
      {onRemove && (
        <button data-testid="remove-group" onClick={onRemove}>
          remove group
        </button>
      )}
      {children}
    </div>
  ),
}))

vi.mock('@/components/shared/AttributeAutocomplete', () => ({
  AttributeAutocomplete: () => (
    <div data-testid="attribute-autocomplete">AttributeAutocomplete</div>
  ),
}))

const mockOpen = vi.fn()
vi.mock('@/components/shared/CustomizeThresholdDrawer', () => ({
  useCustomizeThresholdDrawer: () => ({ open: mockOpen }),
}))

const mockAttribute1 = createMockDescriptorAttribute({ id: 'attr-1', name: 'Attribute 1' })
const mockAttribute2 = createMockDescriptorAttribute({ id: 'attr-2', name: 'Attribute 2' })

const defaultFormValues = {
  attributes: {
    certified: [[mockAttribute1, mockAttribute2]] as Array<Array<DescriptorAttribute>>,
    verified: [] as Array<Array<DescriptorAttribute>>,
    declared: [] as Array<Array<DescriptorAttribute>>,
  },
}

const emptyFormValues = {
  attributes: {
    certified: [[]] as Array<Array<DescriptorAttribute>>,
    verified: [] as Array<Array<DescriptorAttribute>>,
    declared: [] as Array<Array<DescriptorAttribute>>,
  },
}

const renderComponent = (
  props: Partial<React.ComponentProps<typeof AttributeGroup>> = {},
  formValues = defaultFormValues
) => {
  const defaultProps: React.ComponentProps<typeof AttributeGroup> = {
    group: formValues.attributes.certified[0] ?? [],
    groupIndex: 0,
    attributeKey: 'certified',
    readOnly: false,
    onRemoveAttributesGroup: vi.fn(),
    onRemoveAttributeFromGroup: vi.fn(),
    ...props,
  }

  return renderWithApplicationContext(
    <ReactHookFormWrapper defaultValues={formValues}>
      <AttributeGroup {...defaultProps} />
    </ReactHookFormWrapper>,
    { withReactQueryContext: true }
  )
}

describe('AttributeGroup', () => {
  it('should render the group title with AttributeGroupContainer', () => {
    renderComponent()
    expect(screen.getByTestId('attribute-group-container')).toBeInTheDocument()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should show AttributeAutocomplete when the group is empty', () => {
    renderComponent({ group: [] }, emptyFormValues)
    expect(screen.getByTestId('attribute-autocomplete')).toBeInTheDocument()
  })

  it('should show attributes when the group has elements', () => {
    renderComponent()
    expect(screen.getByTestId('attribute-container-attr-1')).toBeInTheDocument()
    expect(screen.getByTestId('attribute-container-attr-2')).toBeInTheDocument()
  })

  it('should show the OR separator between multiple attributes', () => {
    renderComponent()
    expect(screen.getByText('orSeparator')).toBeInTheDocument()
  })

  it('should show the "addAnotherBtn" button when there are attributes and not readOnly', () => {
    renderComponent()
    expect(screen.getByText('addAnotherBtn')).toBeInTheDocument()
  })

  it('should not show autocomplete or buttons in readOnly mode', () => {
    renderComponent({ readOnly: true })
    expect(screen.queryByTestId('attribute-autocomplete')).not.toBeInTheDocument()
    expect(screen.queryByText('addAnotherBtn')).not.toBeInTheDocument()
  })

  it('should show AttributeAutocomplete after removing the last attribute from the group', () => {
    const singleAttrFormValues = {
      attributes: {
        certified: [[mockAttribute1]] as Array<Array<DescriptorAttribute>>,
        verified: [] as Array<Array<DescriptorAttribute>>,
        declared: [] as Array<Array<DescriptorAttribute>>,
      },
    }
    const onRemoveAttributeFromGroup = vi.fn()
    renderComponent(
      {
        group: [mockAttribute1],
        onRemoveAttributeFromGroup,
      },
      singleAttrFormValues
    )

    // Before removal, the "addAnotherBtn" should be visible (not autocomplete)
    expect(screen.getByText('addAnotherBtn')).toBeInTheDocument()
    expect(screen.queryByTestId('attribute-autocomplete')).not.toBeInTheDocument()

    // Click remove on the only attribute - this triggers handleDeleteAttributeFromGroup
    // which calls onRemoveAttributeFromGroup AND sets isAttributeAutocompleteShown to true
    // because group.length === 1
    fireEvent.click(screen.getByTestId('remove-attr-1'))

    // The onRemoveAttributeFromGroup callback should have been called
    expect(onRemoveAttributeFromGroup).toHaveBeenCalled()

    // After removing the last attribute, autocomplete should show due to state change
    expect(screen.getByTestId('attribute-autocomplete')).toBeInTheDocument()
  })
})

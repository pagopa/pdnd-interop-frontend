import React from 'react'
import { AttributeGroup, type AttributeGroupProps } from '../AttributeGroup'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { createMockDescriptorAttribute } from '@/../__mocks__/data/attribute.mocks'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { fireEvent } from '@testing-library/react'
import type { DescriptorAttribute } from '@/api/api.generatedTypes'

const emptyGroup: Array<DescriptorAttribute> = []

const groupWithElements = [createMockDescriptorAttribute({ id: 'attribute-option' })]

const commonProps: AttributeGroupProps = {
  groupIndex: 0,
  group: groupWithElements,
  attributeKey: 'certified',
  readOnly: false,
  onRemoveAttributesGroup: vi.fn(),
  onRemoveAttributeFromGroup: vi.fn(),
}

describe("Checks that AttributeGroup snapshot don't change", () => {
  it('renders correctly with attributeKey certified, emptyGroup and readOnly to true', () => {
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup
        {...commonProps}
        groupIndex={0}
        group={emptyGroup}
        attributeKey="certified"
        readOnly={true}
      />,
      {
        withReactQueryContext: true,
      }
    )

    expect(groupComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey verified, emptyGroup and readOnly to true', () => {
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup
        {...commonProps}
        groupIndex={0}
        group={emptyGroup}
        attributeKey="verified"
        readOnly={true}
      />,
      {
        withReactQueryContext: true,
      }
    )

    expect(groupComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey declared, emptyGroup and readOnly to true', () => {
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup
        {...commonProps}
        groupIndex={0}
        group={emptyGroup}
        attributeKey="declared"
        readOnly={true}
      />,
      {
        withReactQueryContext: true,
      }
    )

    expect(groupComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey certified, populated group and readOnly to true', () => {
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup
        {...commonProps}
        groupIndex={0}
        group={groupWithElements}
        attributeKey="certified"
        readOnly={true}
      />,
      {
        withReactQueryContext: true,
      }
    )

    expect(groupComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey verified, populated group and readOnly to true', () => {
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup
        {...commonProps}
        groupIndex={0}
        group={groupWithElements}
        attributeKey="verified"
        readOnly={true}
      />,
      {
        withReactQueryContext: true,
      }
    )

    expect(groupComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey declared, populated group and readOnly to true', () => {
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup
        {...commonProps}
        groupIndex={0}
        group={groupWithElements}
        attributeKey="declared"
        readOnly={true}
      />,
      {
        withReactQueryContext: true,
      }
    )

    expect(groupComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey certified, emptyGroup and readOnly to false', () => {
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup
        {...commonProps}
        groupIndex={0}
        group={emptyGroup}
        attributeKey="certified"
        readOnly={false}
      />,
      {
        withReactQueryContext: true,
      }
    )

    expect(groupComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey verified, emptyGroup and readOnly to false', () => {
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup
        {...commonProps}
        groupIndex={0}
        group={emptyGroup}
        attributeKey="verified"
        readOnly={false}
      />,
      {
        withReactQueryContext: true,
      }
    )

    expect(groupComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey declared, emptyGroup and readOnly to false', () => {
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup
        {...commonProps}
        groupIndex={0}
        group={emptyGroup}
        attributeKey="declared"
        readOnly={false}
      />,
      {
        withReactQueryContext: true,
      }
    )

    expect(groupComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey certified, populated group and readOnly to false', () => {
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup
        {...commonProps}
        groupIndex={0}
        group={groupWithElements}
        attributeKey="certified"
        readOnly={false}
      />,
      {
        withReactQueryContext: true,
      }
    )

    expect(groupComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey verified, populated group and readOnly to false', () => {
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup
        {...commonProps}
        groupIndex={0}
        group={groupWithElements}
        attributeKey="verified"
        readOnly={false}
      />,
      {
        withReactQueryContext: true,
      }
    )

    expect(groupComponent.baseElement).toMatchSnapshot()
  })

  it('renders correctly with attributeKey declared, populated group and readOnly to false', () => {
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup
        {...commonProps}
        groupIndex={0}
        group={groupWithElements}
        attributeKey="declared"
        readOnly={false}
      />,
      {
        withReactQueryContext: true,
      }
    )

    expect(groupComponent.baseElement).toMatchSnapshot()
  })
})

describe('determine the element functionalities', () => {
  it('should render correctly on isAttributeAutocompleteShown value changes', async () => {
    const user = userEvent.setup()
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup
        {...commonProps}
        groupIndex={0}
        group={emptyGroup}
        attributeKey="certified"
        readOnly={false}
      />,
      {
        withReactQueryContext: true,
      }
    )

    vi.mock('react-hook-form', async () => ({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      ...(await vi.importActual('react-hook-form')),
      useFormContext: () => ({
        watch: () => [[]],
        setValue: vi.fn(),
        formState: {
          errors: {},
        },
      }),
    }))

    const button = groupComponent.getByRole('button', { name: 'addBtn' })

    expect(button).toBeInTheDocument()
    expect(groupComponent.queryByLabelText('autocompleteInput.label')).not.toBeInTheDocument()

    await user.click(button)

    expect(button).not.toBeInTheDocument()
    expect(groupComponent.queryByLabelText('autocompleteInput.label')).toBeInTheDocument()
  })

  it('should correctly call onRemoveAttributesGroup callback function', async () => {
    const user = userEvent.setup()
    const onRemoveAttributesGroupFn = vi.fn()
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup {...commonProps} onRemoveAttributesGroup={onRemoveAttributesGroupFn} />,
      { withReactQueryContext: true }
    )
    const button = groupComponent.getByRole('button', { name: 'removeGroupAriaLabel' })
    await user.click(button)
    expect(onRemoveAttributesGroupFn).toBeCalledWith(0)
  })

  it('should correctly call onRemoveAttributeFromGroup callback function', async () => {
    const onRemoveAttributeFromGroupFn = vi.fn()
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup {...commonProps} onRemoveAttributeFromGroup={onRemoveAttributeFromGroupFn} />,
      { withReactQueryContext: true }
    )

    const button = groupComponent.getByRole('button', { name: 'removeAttributeAriaLabel' })

    fireEvent.click(button)

    expect(onRemoveAttributeFromGroupFn).toBeCalledWith('attribute-option', 0)
  })
})

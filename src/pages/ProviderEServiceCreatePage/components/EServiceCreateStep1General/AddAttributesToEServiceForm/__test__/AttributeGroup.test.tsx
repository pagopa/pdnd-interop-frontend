import React from 'react'
import { AttributeGroup, type AttributeGroupProps } from '../AttributeGroup'
import type { RemappedEServiceAttribute } from '@/types/attribute.types'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import {
  createMockCompactAttribute,
  createMockRemappedEServiceAttribute,
} from '__mocks__/data/attribute.mocks'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const emptyGroup: RemappedEServiceAttribute = {
  attributes: [],
  explicitAttributeVerification: false,
}

const groupWithElements = createMockRemappedEServiceAttribute({
  attributes: [createMockCompactAttribute({ id: 'attribute-option' })],
})

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
  it('should render correcly on isAttributeAutocompleteShown value changes', async () => {
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
        watch: () => [
          {
            attributes: [],
            explicitAttributeVerification: false,
          },
        ],
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

    const autocompleteCancelButton = groupComponent.getByRole('button', { name: 'cancelBtn' })

    await user.click(autocompleteCancelButton)

    expect(groupComponent.queryByRole('button', { name: 'addBtn' })).toBeInTheDocument()
    expect(groupComponent.queryByLabelText('autocompleteInput.label')).not.toBeInTheDocument()
  })

  it('should correctly call onRemoveAttributesGroup callback function', async () => {
    const user = userEvent.setup()
    const onRemoveAttributesGroupFn = vi.fn()
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup {...commonProps} onRemoveAttributesGroup={onRemoveAttributesGroupFn} />,
      { withReactQueryContext: true }
    )
    const button = groupComponent.getByLabelText('deleteGroupSrLabel')
    await user.click(button)
    expect(onRemoveAttributesGroupFn).toBeCalledWith(0)
  })

  it('should correctly call onRemoveAttributeFromGroup callback function', async () => {
    const user = userEvent.setup()
    const onRemoveAttributeFromGroupFn = vi.fn()
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup {...commonProps} onRemoveAttributeFromGroup={onRemoveAttributeFromGroupFn} />,
      { withReactQueryContext: true }
    )

    const buttons = groupComponent.getAllByTestId('DeleteOutlineIcon')

    await user.click(buttons[1])

    expect(onRemoveAttributeFromGroupFn).toBeCalledWith('attribute-option', 0)
  })
})

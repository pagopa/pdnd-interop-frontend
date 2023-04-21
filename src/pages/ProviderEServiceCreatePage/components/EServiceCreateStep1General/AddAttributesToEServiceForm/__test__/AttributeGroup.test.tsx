import React from 'react'
import { AttributeGroup, type AttributeGroupProps } from '../AttributeGroup'
import type { FrontendAttribute } from '@/types/attribute.types'
import { render, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import {
  createMockAttribute,
  createMockCompactAttribute,
  createMockFrontendAttribute,
} from '__mocks__/data/attribute.mocks'
import { FormProvider, useForm } from 'react-hook-form'
import type { Attribute, CompactAttribute } from '@/api/api.generatedTypes'
import { AttributeQueries } from '@/api/attribute'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const emptyGroup: FrontendAttribute = {
  attributes: [],
  explicitAttributeVerification: false,
}

const commonProps: AttributeGroupProps = {
  groupIndex: 0,
  group: emptyGroup,
  attributeKey: 'certified',
  readOnly: false,
  onRemoveAttributesGroup: vi.fn(),
  onRemoveAttributeFromGroup: vi.fn(),
}

const groupWithElements = createMockFrontendAttribute({
  attributes: [createMockCompactAttribute({ id: 'attribute-option' })],
})

// describe("Checks that AttributeGroup snapshot don't change", () => {
//   it('renders correctly with attributeKey certified, emptyGroup and readOnly to true', () => {
//     const groupComponent = renderAttributeGroup({
//       groupIndex: 0,
//       group: emptyGroup,
//       attributeKey: 'certified',
//       readOnly: true,
//     })

//     expect(groupComponent.baseElement).toMatchSnapshot()
//   })

//   it('renders correctly with attributeKey verified, emptyGroup and readOnly to true', () => {
//     const groupComponent = renderAttributeGroup({
//       groupIndex: 0,
//       group: emptyGroup,
//       attributeKey: 'verified',
//       readOnly: true,
//     })

//     expect(groupComponent.baseElement).toMatchSnapshot()
//   })

//   it('renders correctly with attributeKey declared, emptyGroup and readOnly to true', () => {
//     const groupComponent = renderAttributeGroup({
//       groupIndex: 0,
//       group: emptyGroup,
//       attributeKey: 'declared',
//       readOnly: true,
//     })

//     expect(groupComponent.baseElement).toMatchSnapshot()
//   })

//   it('renders correctly with attributeKey certified, populated group and readOnly to true', () => {
//     const attribute = createMockAttribute()
//     mockPrefetchSingleSpy(attribute)
//     const groupComponent = renderAttributeGroup({
//       groupIndex: 0,
//       group: groupWithElements,
//       attributeKey: 'certified',
//       readOnly: true,
//     })

//     expect(groupComponent.baseElement).toMatchSnapshot()
//   })

//   it('renders correctly with attributeKey verified, populated group and readOnly to true', () => {
//     const attribute = createMockAttribute()
//     mockPrefetchSingleSpy(attribute)
//     const groupComponent = renderAttributeGroup({
//       groupIndex: 0,
//       group: groupWithElements,
//       attributeKey: 'verified',
//       readOnly: true,
//     })

//     expect(groupComponent.baseElement).toMatchSnapshot()
//   })

//   it('renders correctly with attributeKey declared, populated group and readOnly to true', () => {
//     const attribute = createMockAttribute()
//     mockPrefetchSingleSpy(attribute)
//     const groupComponent = renderAttributeGroup({
//       groupIndex: 0,
//       group: groupWithElements,
//       attributeKey: 'declared',
//       readOnly: true,
//     })

//     expect(groupComponent.baseElement).toMatchSnapshot()
//   })

//   it('renders correctly with attributeKey certified, emptyGroup and readOnly to false', () => {
//     const groupComponent = renderAttributeGroup({
//       groupIndex: 0,
//       group: emptyGroup,
//       attributeKey: 'certified',
//       readOnly: false,
//     })

//     expect(groupComponent.baseElement).toMatchSnapshot()
//   })

//   it('renders correctly with attributeKey verified, emptyGroup and readOnly to false', () => {
//     const groupComponent = renderAttributeGroup({
//       groupIndex: 0,
//       group: emptyGroup,
//       attributeKey: 'verified',
//       readOnly: false,
//     })

//     expect(groupComponent.baseElement).toMatchSnapshot()
//   })

//   it('renders correctly with attributeKey declared, emptyGroup and readOnly to false', () => {
//     const groupComponent = renderAttributeGroup({
//       groupIndex: 0,
//       group: emptyGroup,
//       attributeKey: 'declared',
//       readOnly: false,
//     })

//     expect(groupComponent.baseElement).toMatchSnapshot()
//   })

//   it('renders correctly with attributeKey certified, populated group and readOnly to false', () => {
//     const attribute = createMockAttribute()
//     mockPrefetchSingleSpy(attribute)
//     const groupComponent = renderAttributeGroup({
//       groupIndex: 0,
//       group: groupWithElements,
//       attributeKey: 'certified',
//       readOnly: false,
//     })

//     expect(groupComponent.baseElement).toMatchSnapshot()
//   })

//   it('renders correctly with attributeKey verified, populated group and readOnly to false', () => {
//     const attribute = createMockAttribute()
//     mockPrefetchSingleSpy(attribute)
//     const groupComponent = renderAttributeGroup({
//       groupIndex: 0,
//       group: groupWithElements,
//       attributeKey: 'verified',
//       readOnly: false,
//     })

//     expect(groupComponent.baseElement).toMatchSnapshot()
//   })

//   it('renders correctly with attributeKey declared, populated group and readOnly to false', () => {
//     const attribute = createMockAttribute()
//     mockPrefetchSingleSpy(attribute)
//     const groupComponent = renderAttributeGroup({
//       groupIndex: 0,
//       group: groupWithElements,
//       attributeKey: 'declared',
//       readOnly: false,
//     })

//     expect(groupComponent.baseElement).toMatchSnapshot()
//   })
// })

describe('determine the element functionalities', () => {
  // it('renders correcly on isAttributeAutocompleteShown value changes', async () => {
  //   const user = userEvent.setup()
  //   mockGetListSpy([createMockCompactAttribute({ id: 'attribute-option' })])
  //   const groupComponent = renderAttributeGroup({
  //     groupIndex: 0,
  //     group: emptyGroup,
  //     attributeKey: 'certified',
  //     readOnly: false,
  //   })

  //   const button = groupComponent.getByRole('button', { name: 'addBtn' })

  //   expect(button).toBeInTheDocument()
  //   expect(groupComponent.queryByLabelText('autocompleteInput.label')).not.toBeInTheDocument()

  //   await user.click(button)

  //   expect(button).not.toBeInTheDocument()
  //   expect(groupComponent.queryByLabelText('autocompleteInput.label')).toBeInTheDocument()

  //   const autocompleteCancelButton = groupComponent.getByRole('button', { name: 'cancelBtn' })

  //   await user.click(autocompleteCancelButton)

  //   expect(groupComponent.queryByRole('button', { name: 'addBtn' })).toBeInTheDocument()
  //   expect(groupComponent.queryByLabelText('autocompleteInput.label')).not.toBeInTheDocument()
  // })

  it('should correctly call onRemoveAttributesGroup callback function', async () => {
    const user = userEvent.setup()
    const onRemoveAttributesGroupFn = vi.fn()
    const groupComponent = renderWithApplicationContext(
      <AttributeGroup {...commonProps} onRemoveAttributesGroup={onRemoveAttributesGroupFn} />,
      { withReactQueryContext: true }
    )
    groupComponent.debug()
    const button = groupComponent.getByLabelText('deleteGroupSrLabel')
    await user.click(button)
    expect(onRemoveAttributesGroupFn).toBeCalledWith(0)
  })

  // it('renders correcly when an attribute is deleted from group', async () => {
  //   const user = userEvent.setup()
  //   const groupComponent = renderAttributeGroup(
  //     {
  //       groupIndex: 0,
  //       group: groupWithElements,
  //       attributeKey: 'certified',
  //       readOnly: false,
  //     },
  //     {
  //       attributes: {
  //         certified: [
  //           createMockFrontendAttribute({
  //             attributes: [createMockCompactAttribute({ id: 'attribute-option' })],
  //           }),
  //         ],
  //         verified: [],
  //         declared: [],
  //       },
  //     }
  //   )

  //   const buttons = groupComponent.getAllByTestId('DeleteOutlineIcon')

  //   expect(groupComponent.queryByText('Attribute Name')).toBeInTheDocument()

  //   // await user.click(buttons[1])

  //   // expect(groupComponent.queryByText('Attribute Name')).not.toBeInTheDocument()
  // })
})

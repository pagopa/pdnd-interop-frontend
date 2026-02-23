import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { AddAttributesToForm } from '../AddAttributesToForm'
import { vi, describe, it, expect } from 'vitest'
import { renderWithApplicationContext, ReactHookFormWrapper } from '@/utils/testing.utils'

vi.mock('../AttributeGroup', () => ({
  AttributeGroup: ({ groupIndex, attributeKey }: { groupIndex: number; attributeKey: string }) => (
    <div data-testid={`attribute-group-${groupIndex}`}>
      AttributeGroup {attributeKey} {groupIndex}
    </div>
  ),
}))

const defaultFormValues = {
  attributes: {
    certified: [] as Array<Array<unknown>>,
    verified: [] as Array<Array<unknown>>,
    declared: [] as Array<Array<unknown>>,
  },
}

const renderComponent = (props: Partial<React.ComponentProps<typeof AddAttributesToForm>> = {}) => {
  const defaultProps: React.ComponentProps<typeof AddAttributesToForm> = {
    attributeKey: 'certified',
    readOnly: false,
    addGroupLabel: 'addGroupLabel',
    ...props,
  }

  return renderWithApplicationContext(
    <ReactHookFormWrapper defaultValues={defaultFormValues}>
      <AddAttributesToForm {...defaultProps} />
    </ReactHookFormWrapper>,
    { withReactQueryContext: true }
  )
}

describe('AddAttributesToForm', () => {
  it('should render the "addGroupLabel" button when not readOnly', () => {
    renderComponent()
    expect(screen.getByRole('button', { name: 'addGroupLabel' })).toBeInTheDocument()
  })

  it('should not render the "addGroupLabel" button when readOnly', () => {
    renderComponent({ readOnly: true })
    expect(screen.queryByRole('button', { name: 'addGroupLabel' })).not.toBeInTheDocument()
  })

  it('should render the "createAttributeLabel" ButtonNaked when createAttributeAction is provided and not readOnly', () => {
    renderComponent({
      createAttributeAction: { label: 'createAttributeLabel', openDrawer: vi.fn() },
    })
    expect(screen.getByText('createAttributeLabel')).toBeInTheDocument()
  })

  it('should not render the "createAttributeLabel" when readOnly', () => {
    renderComponent({
      readOnly: true,
      createAttributeAction: { label: 'createAttributeLabel', openDrawer: vi.fn() },
    })
    expect(screen.queryByText('createAttributeLabel')).not.toBeInTheDocument()
  })

  it('should disable the "addGroupLabel" button when an empty group exists', () => {
    renderComponent()
    // Initially no groups, button is enabled
    const addBtn = screen.getByRole('button', { name: 'addGroupLabel' })
    expect(addBtn).not.toBeDisabled()

    // Click to add an empty group
    fireEvent.click(addBtn)

    // Now there's an empty group, button should be disabled
    expect(screen.getByRole('button', { name: 'addGroupLabel' })).toBeDisabled()
  })

  it('should call createAttributeAction.openDrawer on click of the ButtonNaked', () => {
    const openDrawer = vi.fn()
    renderComponent({
      createAttributeAction: { label: 'createAttributeLabel', openDrawer },
    })
    fireEvent.click(screen.getByText('createAttributeLabel'))
    expect(openDrawer).toHaveBeenCalled()
  })

  it('should render the SectionContainer with title when hideTitle is not true', () => {
    renderComponent({ hideTitle: false })
    expect(screen.getByText('certified.label')).toBeInTheDocument()
  })

  it('should not render the SectionContainer when hideTitle is true', () => {
    renderComponent({ hideTitle: true })
    expect(screen.queryByText('certified.label')).not.toBeInTheDocument()
  })
})

import { fireEvent, screen } from '@testing-library/react'
import { AttributeContainer } from '../AttributeContainer'
import { vi, describe, it, expect } from 'vitest'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockAttribute } from '../../../../../__mocks__/data/attribute.mocks'
import userEvent from '@testing-library/user-event'

const baseAttribute = createMockAttribute({ id: 'attr-1', name: 'Test Attribute' })

vi.mock('@/api/attribute', () => ({
  AttributeQueries: {
    getSingle: vi.fn((id: string) => ({
      queryKey: ['attribute', id],
      queryFn: vi.fn().mockReturnValue(baseAttribute),
    })),
  },
}))

describe('AttributeContainer', () => {
  it('should render the attribute name', () => {
    renderWithApplicationContext(<AttributeContainer attribute={baseAttribute} />, {
      withReactQueryContext: true,
    })
    expect(screen.getByText('Test Attribute')).toBeInTheDocument()
  })

  it('should show the remove button when onRemove is provided', () => {
    renderWithApplicationContext(
      <AttributeContainer attribute={baseAttribute} onRemove={vi.fn()} />,
      { withReactQueryContext: true }
    )
    expect(screen.getByRole('button', { name: 'removeAttributeAriaLabel' })).toBeInTheDocument()
  })

  it('should not show the remove button when onRemove is not provided', () => {
    renderWithApplicationContext(<AttributeContainer attribute={baseAttribute} />, {
      withReactQueryContext: true,
    })
    expect(
      screen.queryByRole('button', { name: 'removeAttributeAriaLabel' })
    ).not.toBeInTheDocument()
  })

  it('should call onRemove with id and name when remove button is clicked', () => {
    const onRemove = vi.fn()
    renderWithApplicationContext(
      <AttributeContainer attribute={baseAttribute} onRemove={onRemove} />,
      { withReactQueryContext: true }
    )
    fireEvent.click(screen.getByRole('button', { name: 'removeAttributeAriaLabel' }))
    expect(onRemove).toHaveBeenCalled()
    expect(onRemove.mock.calls[0][0]).toBe('attr-1')
    expect(onRemove.mock.calls[0][1]).toBe('Test Attribute')
  })

  it('should show "customizeThreshold" when onCustomizeThreshold is provided and no dailyCallsPerConsumer', () => {
    renderWithApplicationContext(
      <AttributeContainer attribute={baseAttribute} onCustomizeThreshold={vi.fn()} />,
      { withReactQueryContext: true }
    )
    expect(screen.getByText('actions.customizeThreshold')).toBeInTheDocument()
  })

  it('should show "changeThreshold" inside the action menu when onCustomizeThreshold is provided and dailyCallsPerConsumer exists', async () => {
    const user = userEvent.setup()
    renderWithApplicationContext(
      <AttributeContainer
        attribute={{ ...baseAttribute, dailyCallsPerConsumer: 100 }}
        onCustomizeThreshold={vi.fn()}
      />,
      { withReactQueryContext: true }
    )

    const menuActionsIconButton = screen.getByLabelText('iconButtonAriaLabel')
    await user.click(menuActionsIconButton)

    expect(screen.getByRole('menuitem', { name: 'actions.changeThreshold' })).toBeInTheDocument()
  })

  it('should call onCustomizeThreshold on click with stopPropagation', () => {
    const onCustomizeThreshold = vi.fn()
    renderWithApplicationContext(
      <AttributeContainer attribute={baseAttribute} onCustomizeThreshold={onCustomizeThreshold} />,
      { withReactQueryContext: true }
    )
    const btn = screen.getByText('actions.customizeThreshold')
    const clickEvent = new MouseEvent('click', { bubbles: true })
    const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation')
    fireEvent(btn, clickEvent)
    expect(onCustomizeThreshold).toHaveBeenCalled()
    expect(stopPropagationSpy).toHaveBeenCalled()
  })

  it('should show the check icon when checked is true', () => {
    renderWithApplicationContext(<AttributeContainer attribute={baseAttribute} checked />, {
      withReactQueryContext: true,
    })
    expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument()
  })

  it('should show the chip when chipLabel is provided', () => {
    renderWithApplicationContext(
      <AttributeContainer attribute={baseAttribute} chipLabel="My Chip" />,
      { withReactQueryContext: true }
    )
    expect(screen.getByText('My Chip')).toBeInTheDocument()
  })
})

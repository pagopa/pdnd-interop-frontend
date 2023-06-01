import React from 'react'
import { AttributeContainer, AttributeContainerSkeleton } from '../AttributeContainer'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { AttributeQueries } from '@/api/attribute'
import userEvent from '@testing-library/user-event'
import type { Attribute } from '@/api/api.generatedTypes'
import { createMockAttribute } from '__mocks__/data/attribute.mocks'

const mockUseGetSingleAttribute = ({
  isInitialLoading,
  data = createMockAttribute(),
}: {
  isInitialLoading: boolean
  data?: Attribute
}) => {
  vi.spyOn(AttributeQueries, 'useGetSingle').mockReturnValue({
    isInitialLoading,
    data,
  } as unknown as ReturnType<typeof AttributeQueries.useGetSingle>)
}

describe('AttributeContainer', () => {
  it('should match snapshot', () => {
    const screen = renderWithApplicationContext(
      <AttributeContainer attribute={{ id: 'test-id', name: 'Test' }} />,
      { withReactQueryContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with chip label', () => {
    const screen = renderWithApplicationContext(
      <AttributeContainer attribute={{ id: 'test-id', name: 'Test' }} chipLabel="chip-label" />,
      { withReactQueryContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with checked icon', () => {
    const screen = renderWithApplicationContext(
      <AttributeContainer attribute={{ id: 'test-id', name: 'Test' }} checked />,
      { withReactQueryContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with remove icon', () => {
    const removeFn = vi.fn()
    const screen = renderWithApplicationContext(
      <AttributeContainer attribute={{ id: 'test-id', name: 'Test' }} onRemove={removeFn} />,
      { withReactQueryContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot()
    const removeButton = screen.getByRole('button', { name: 'removeAttributeAriaLabel' })
    fireEvent.click(removeButton)
    expect(removeFn).toBeCalledTimes(1)
  })

  it('should match snapshot with actions', () => {
    const actionOne = vi.fn()
    const actionTwo = vi.fn()
    const screen = renderWithApplicationContext(
      <AttributeContainer
        attribute={{ id: 'test-id', name: 'Test' }}
        actions={[
          { label: 'action-1', action: actionOne },
          { label: 'action-2', action: actionTwo },
        ]}
      />,
      { withReactQueryContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot()
    const actionOneButton = screen.getByRole('button', { name: 'action-1' })
    const actionTwoButton = screen.getByRole('button', { name: 'action-2' })
    fireEvent.click(actionOneButton)
    expect(actionOne).toBeCalledTimes(1)
    fireEvent.click(actionTwoButton)
    expect(actionTwo).toBeCalledTimes(1)
  })

  it('should prefetch only once', async () => {
    const prefetchFn = vi.fn()
    vi.spyOn(AttributeQueries, 'usePrefetchSingle').mockReturnValue(prefetchFn)

    const screen = renderWithApplicationContext(
      <AttributeContainer attribute={{ id: 'test-id', name: 'Test' }} />,
      { withReactQueryContext: true }
    )

    const accordion = screen.getByRole('button', { name: 'Test' })
    const user = userEvent.setup()
    await user.hover(accordion)
    await user.unhover(accordion)
    await user.hover(accordion)
    await user.unhover(accordion)
    expect(prefetchFn).toBeCalledTimes(1)
    screen.debug()
  })

  it('should match snapshot on opening accordion and loading attribute', async () => {
    mockUseGetSingleAttribute({ isInitialLoading: true })
    const screen = renderWithApplicationContext(
      <AttributeContainer attribute={{ id: 'test-id', name: 'Test' }} />,
      { withReactQueryContext: true }
    )
    const accordion = screen.getByRole('button', { name: 'Test' })
    fireEvent.click(accordion)
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot on opening accordion with loading attribute complete', async () => {
    mockUseGetSingleAttribute({ isInitialLoading: false })
    const screen = renderWithApplicationContext(
      <AttributeContainer attribute={{ id: 'test-id', name: 'Test' }} />,
      { withReactQueryContext: true }
    )
    const accordion = screen.getByRole('button', { name: 'Test' })
    fireEvent.click(accordion)
    expect(screen.baseElement).toMatchSnapshot()
  })
})

describe('AttributeContainerSkeleton', () => {
  it('should match snapshot', () => {
    const screen = render(<AttributeContainerSkeleton />)
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot (checked)', () => {
    const screen = render(<AttributeContainerSkeleton checked />)
    expect(screen.baseElement).toMatchSnapshot()
  })
})

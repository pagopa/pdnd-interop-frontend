import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { AttributeGroupContainer } from '../AttributeGroupContainer'
import { vi } from 'vitest'

describe('AttributeGroupContainer', () => {
  it('should call on remove action', () => {
    const removeFn = vi.fn()
    const screen = render(
      <AttributeGroupContainer title="title" onRemove={removeFn}>
        <></>
      </AttributeGroupContainer>
    )
    const removeButton = screen.getByRole('button', { name: 'removeGroupAriaLabel' })
    fireEvent.click(removeButton)
    expect(removeFn).toHaveBeenCalled()
  })
  // it('should match snapshot with footer content', () => {
  //   const { baseElement } = render(
  //     <AttributeGroupContainer groupNum={1} footerContent={<></>}>
  //       {}
  //     </AttributeGroupContainer>
  //   )
  //   expect(baseElement).toMatchSnapshot()
  // })
  // it('should match snapshot with both footer and header content', () => {
  //   const { baseElement } = render(
  //     <AttributeGroupContainer groupNum={1} headerContent={<></>} footerContent={<></>}>
  //       {}
  //     </AttributeGroupContainer>
  //   )
  //   expect(baseElement).toMatchSnapshot()
  // })
})

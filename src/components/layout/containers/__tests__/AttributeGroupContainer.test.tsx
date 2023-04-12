import React from 'react'
import { render } from '@testing-library/react'
import { AttributeGroupContainer } from '../AttributeGroupContainer'

describe('AttributeGroupContainer', () => {
  it('should match snapshot', () => {
    const { container } = render(<AttributeGroupContainer groupNum={1}>{}</AttributeGroupContainer>)
    expect(container).toMatchSnapshot()
  })

  it('should match snapshot with header content', () => {
    const { container } = render(
      <AttributeGroupContainer groupNum={1} headerContent={<></>}>
        {}
      </AttributeGroupContainer>
    )
    expect(container).toMatchSnapshot()
  })

  it('should match snapshot with footer content', () => {
    const { container } = render(
      <AttributeGroupContainer groupNum={1} footerContent={<></>}>
        {}
      </AttributeGroupContainer>
    )
    expect(container).toMatchSnapshot()
  })

  it('should match snapshot with both footer and header content', () => {
    const { container } = render(
      <AttributeGroupContainer groupNum={1} headerContent={<></>} footerContent={<></>}>
        {}
      </AttributeGroupContainer>
    )
    expect(container).toMatchSnapshot()
  })
})

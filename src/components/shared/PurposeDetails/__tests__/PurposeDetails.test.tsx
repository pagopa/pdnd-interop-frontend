import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import React from 'react'
import { PurposeDetails, PurposeDetailsSkeleton } from '../PurposeDetails'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import { render } from '@testing-library/react'

mockUseJwt()

describe('PurposeDetails', () => {
  it('should match snapshot', () => {
    const { baseElement } = renderWithApplicationContext(
      <PurposeDetails purpose={createMockPurpose()} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(baseElement).toMatchSnapshot()
  })

  it('should not render if the purpose is falsy', () => {
    const { container } = render(<PurposeDetails purpose={undefined} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('PurposeDetailsSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<PurposeDetailsSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})

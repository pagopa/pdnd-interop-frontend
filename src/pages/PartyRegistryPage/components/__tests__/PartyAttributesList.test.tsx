import React from 'react'
import { PartyAttributesList, PartyAttributesListSkeleton } from '../PartyAttributesList'
import { render } from '@testing-library/react'
import { createMockPartyAttribute } from '__mocks__/data/attribute.mocks'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const commonProps = {
  title: 'title',
  description: 'description',
  noAttributesLabel: 'noAttributesLabel',
}

const attributes = [
  createMockPartyAttribute({ id: 'party-attribute-1' }),
  createMockPartyAttribute({ id: 'party-attribute-2' }),
  createMockPartyAttribute({ id: 'party-attribute-3' }),
]

describe('PartyAttributesList', () => {
  it('should match snapshot with attributes and without red border', () => {
    const { baseElement } = renderWithApplicationContext(
      <PartyAttributesList {...commonProps} attributes={attributes} />,
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot with no attributes and without red border', () => {
    const { baseElement } = render(<PartyAttributesList {...commonProps} attributes={[]} />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot with attributes and with red border', () => {
    const { baseElement } = renderWithApplicationContext(
      <PartyAttributesList {...commonProps} attributes={attributes} />,
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot with no attributes and with red border', () => {
    const { baseElement } = render(
      <PartyAttributesList {...commonProps} attributes={[]} showRedBorder />
    )
    expect(baseElement).toMatchSnapshot()
  })
})

describe('PartyAttributesListSkeleton', () => {
  it('should match snapshot without red border', () => {
    const { baseElement } = render(<PartyAttributesListSkeleton {...commonProps} />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot with red border', () => {
    const { baseElement } = render(<PartyAttributesListSkeleton {...commonProps} showRedBorder />)
    expect(baseElement).toMatchSnapshot()
  })
})

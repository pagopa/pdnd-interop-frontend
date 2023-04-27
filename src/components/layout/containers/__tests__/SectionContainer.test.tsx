import { render } from '@testing-library/react'
import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '../SectionContainer'

describe('SectionContainer', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<SectionContainer>{}</SectionContainer>)
    expect(baseElement).toMatchSnapshot()
  })

  it('should render correctly with title', () => {
    const { baseElement } = render(<SectionContainer title="title">{}</SectionContainer>)
    expect(baseElement).toMatchSnapshot()
  })

  it('should render correctly with description', () => {
    const { baseElement } = render(
      <SectionContainer description="description">{}</SectionContainer>
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should render correctly with title and description', () => {
    const { baseElement } = render(
      <SectionContainer title="title" description="description">
        {}
      </SectionContainer>
    )
    expect(baseElement).toMatchSnapshot()
  })
})

describe('SectionContainerSkeleton', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<SectionContainerSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})

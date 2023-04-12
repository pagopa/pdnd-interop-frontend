import { render } from '@testing-library/react'
import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '../SectionContainer'

describe('SectionContainer', () => {
  it('should render correctly', () => {
    const wrapper = render(<SectionContainer>{}</SectionContainer>)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correctly with title', () => {
    const wrapper = render(<SectionContainer title="title">{}</SectionContainer>)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correctly with description', () => {
    const wrapper = render(<SectionContainer description="description">{}</SectionContainer>)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correctly with title and description', () => {
    const wrapper = render(
      <SectionContainer title="title" description="description">
        {}
      </SectionContainer>
    )
    expect(wrapper).toMatchSnapshot()
  })
})

describe('SectionContainerSkeleton', () => {
  it('should render correctly', () => {
    const wrapper = render(<SectionContainerSkeleton />)
    expect(wrapper).toMatchSnapshot()
  })
})

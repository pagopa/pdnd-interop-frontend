import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { render, screen } from '@testing-library/react'
import { DescriptionBlock } from '../DescriptionBlock'

describe('Rendering tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<DescriptionBlock label="test" />, div)
  })

  it('renders a test label', () => {
    render(<DescriptionBlock label="test" />)
    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('renders a test tooltip', () => {
    render(<DescriptionBlock label="test" tooltipLabel="tooltip-test" />)
    expect(screen.getByLabelText('tooltip-test')).toBeInTheDocument()
  })

  it('renders some content', () => {
    render(
      <DescriptionBlock label="test">
        <span>content-test</span>
      </DescriptionBlock>
    )
    expect(screen.getByText('content-test')).toBeInTheDocument()
  })
})

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(
      <DescriptionBlock label="test" tooltipLabel="tooltip-test">
        <span>content-test</span>
      </DescriptionBlock>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

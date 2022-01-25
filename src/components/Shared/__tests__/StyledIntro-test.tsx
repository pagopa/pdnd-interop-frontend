import React from 'react'
import renderer from 'react-test-renderer'
import { StyledIntro } from '../StyledIntro'

describe('Snapshot', () => {
  it('matches main page title - h1', () => {
    const props = { title: 'Test h1', description: 'Lorem ipsum dolor sit amet...' }
    const component = renderer.create(<StyledIntro>{props}</StyledIntro>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches paragraph title - h3', () => {
    const props = { title: 'Test h3', description: 'Lorem ipsum dolor sit amet...' }
    const component = renderer.create(<StyledIntro variant="h3">{props}</StyledIntro>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

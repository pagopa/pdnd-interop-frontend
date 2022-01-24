import React from 'react'
import renderer from 'react-test-renderer'
import { StyledDeleteableDocument } from '../StyledDeleteableDocument'

describe('Snapshot', () => {
  it('matches', () => {
    const eserviceId = 'dsjfisdjfew3ef3e-je9fje3fe3-ejf39fjfej'
    const descriptorId = 'ijoijeoife2ioejk-j9ejfpe29j-je90jfe209'
    const readable = {
      contentType: '',
      description: 'Lorem ipsum dolor sit amet...',
      id: 'disfojasdofjido-sdjifodjofj-djfisdojf',
      name: 'Il mio documento',
    }
    const deleteDocument = () => Promise.resolve()
    const props = { eserviceId, descriptorId, readable, deleteDocument }

    const component = renderer.create(<StyledDeleteableDocument {...props} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

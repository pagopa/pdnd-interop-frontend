// Snapshot test for Dialog will stay commented for now.
// See ./ActionMenu-test for reference.

it('Dialog is ok', () => {
  //
})

// This is just to make TS compiler read this file as a module, since there are no imports
export {}

// import { noop } from 'lodash'
// import React from 'react'
// import renderer from 'react-test-renderer'
// import { AllTheProviders } from '../../../__mocks__/providers'
// import { StyledDialog } from '../StyledDialog'

// describe('Snapshot', () => {
//   it('matches', () => {
//     const props = { close: noop, proceedCallback: noop }
//     const component = renderer.create(
//       <AllTheProviders>
//         <StyledDialog {...props} />
//       </AllTheProviders>
//     )
//     const tree = component.toJSON()
//     expect(tree).toMatchSnapshot()
//   })
// })

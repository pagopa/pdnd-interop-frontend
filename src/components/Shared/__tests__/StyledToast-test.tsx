import React from 'react'
import noop from 'lodash/noop'
import renderer from 'react-test-renderer'
import { ToastProps } from '../../../../types'
import { StyledToast } from '../StyledToast'

// For testing this component this way
// see this issue: https://github.com/mui-org/material-ui/issues/17119
describe('Snapshot', () => {
  it('matches success tooltip', () => {
    const props: ToastProps = { outcome: 'success', onClose: noop }
    let component
    renderer.act(() => {
      component = renderer.create(<StyledToast {...props} />, {
        createNodeMock: (node) => {
          return document.createElement(node.type as keyof HTMLElementTagNameMap)
        },
      })
    })
    const tree = (component as unknown as renderer.ReactTestRenderer).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches error tooltip', () => {
    const props: ToastProps = { outcome: 'error', onClose: noop }
    let component
    renderer.act(() => {
      component = renderer.create(<StyledToast {...props} />, {
        createNodeMock: (node) => {
          return document.createElement(node.type as keyof HTMLElementTagNameMap)
        },
      })
    })
    const tree = (component as unknown as renderer.ReactTestRenderer).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

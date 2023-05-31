import React from 'react'
import { AttributeContainer, AttributeContainerSkeleton } from '../AttributeContainer'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

describe('AttributeContainer', () => {
  // it('should match snapshot', () => {
  //   const screen = renderWithApplicationContext(
  //     <AttributeContainer attribute={{ id: 'test-id', name: 'Test' }} />,
  //     { withReactQueryContext: true }
  //   )
  //   expect(screen.baseElement).toMatchSnapshot()
  // })
  // it('should match snapshot with the "or" label', () => {
  //   const screen = renderWithApplicationContext(
  //     <AttributeContainer attribute={{ id: 'test-id', name: 'Test' }} showOrLabel />,
  //     { withReactQueryContext: true }
  //   )
  //   expect(screen.baseElement).toMatchSnapshot()
  // })
  // it('should match snapshot with attribute on active state', () => {
  //   const screen = renderWithApplicationContext(
  //     <AttributeContainer
  //       attribute={{ id: 'test-id', name: 'Test' }}
  //       state="ACTIVE"
  //       kind="CERTIFIED"
  //     />,
  //     { withReactQueryContext: true }
  //   )
  //   expect(screen.baseElement).toMatchSnapshot()
  // })
  // it('should match snapshot with attribute on revoked state', () => {
  //   const screen = renderWithApplicationContext(
  //     <AttributeContainer
  //       attribute={{ id: 'test-id', name: 'Test' }}
  //       state="REVOKED"
  //       kind="CERTIFIED"
  //     />,
  //     { withReactQueryContext: true }
  //   )
  //   expect(screen.baseElement).toMatchSnapshot()
  // })
  // it('should show actions', async () => {
  //   const actionOne = vi.fn()
  //   const actionTwo = vi.fn()
  //   const screen = renderWithApplicationContext(
  //     <AttributeContainer
  //       attribute={{ id: 'test-id', name: 'Test' }}
  //       actions={[
  //         { label: 'action-1', action: actionOne },
  //         { label: 'action-2', action: actionTwo },
  //       ]}
  //     />,
  //     { withReactQueryContext: true }
  //   )
  //   const user = userEvent.setup()
  //   await user.click(screen.getByRole('button', { name: 'action-1' }))
  //   expect(actionOne).toHaveBeenCalledWith('test-id', 'Test', expect.anything())
  //   await user.click(screen.getByRole('button', { name: 'action-2' }))
  //   expect(actionTwo).toHaveBeenCalledWith('test-id', 'Test', expect.anything())
  // })
  // it('should show attribute details dialog', async () => {
  //   const screen = renderWithApplicationContext(
  //     <AttributeContainer attribute={{ id: 'test-id', name: 'Test' }} />,
  //     { withReactQueryContext: true }
  //   )
  //   const user = userEvent.setup()
  //   await user.click(screen.getByRole('button', { name: 'showInfoSrLabel' }))
  //   expect(screen.getByRole('dialog', { name: 'Test' })).toBeInTheDocument()
  // })
})

describe('AttributeContainerSkeleton', () => {
  it('should match snapshot', () => {
    const screen = render(<AttributeContainerSkeleton />)
    expect(screen.baseElement).toMatchSnapshot()
  })
})

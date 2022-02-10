import React from 'react'
import renderer from 'react-test-renderer'
import { noop } from 'lodash'
import { InlineClipboard } from '../InlineClipboard'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AllTheProviders } from '../../../__mocks__/providers'

const addNavigatorSpy = (state: 'granted' | 'denied' | 'prompt') => {
  Object.assign(navigator, {
    clipboard: { writeText: noop },
    permissions: { query: async () => Promise.resolve({ permission: { state } }) },
  })
  jest.spyOn(navigator.clipboard, 'writeText')
  jest.spyOn(navigator.permissions, 'query')
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('Snapshot', () => {
  it('matches without clipboard', () => {
    addNavigatorSpy('denied')

    const component = renderer.create(<InlineClipboard text="This is my text to copy" />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('matches with clipboard', () => {
    addNavigatorSpy('granted')

    const component = renderer.create(<InlineClipboard text="This is my text to copy" />)
    const tree = component.toJSON()

    waitFor(() => {
      expect(screen.getAllByRole('button')).toBeInTheDocument()
      expect(tree).toMatchSnapshot()
    })
  })
})

it('Shows feedback after successful copy', async () => {
  addNavigatorSpy('granted')

  const textToCopy = 'This is my text to copy'

  act(() => {
    render(
      <AllTheProviders>
        <InlineClipboard text={textToCopy} />
      </AllTheProviders>
    )
  })
  expect(screen.getByText(textToCopy)).toBeInTheDocument()

  userEvent.click(screen.getByText(textToCopy))

  waitFor(() => {
    expect(screen.getByText('Messaggio copiato correttamente')).toBeInTheDocument()
  })
})

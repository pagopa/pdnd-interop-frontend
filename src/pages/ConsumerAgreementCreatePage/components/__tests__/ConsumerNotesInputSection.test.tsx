import React from 'react'
import { render } from '@testing-library/react'
import {
  ConsumerNotesInputSection,
  ConsumerNotesInputSectionSkeleton,
} from '../ConsumerNotesInputSection'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'

const commonProps = {
  setConsumerNotes: vi.fn(),
  consumerNotes: '',
}

describe('ConsumerNotesInputSection', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<ConsumerNotesInputSection {...commonProps} />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should correctly call the setConsumerNotes function', async () => {
    const setConsumerNotesFn = vi.fn()
    const screen = render(
      <ConsumerNotesInputSection
        {...commonProps}
        setConsumerNotes={setConsumerNotesFn}
        agreement={createMockAgreement({ consumerNotes: '' })}
      />
    )
    const user = userEvent.setup()
    const consumerNotesInput = screen.getByLabelText('field.label')
    await user.type(consumerNotesInput, 'a')
    expect(setConsumerNotesFn).toHaveBeenCalledWith('a')
  })

  it('should sync with the agreement consumerNotes if it changes', () => {
    const setConsumerNotesFn = vi.fn()

    const screen = render(
      <ConsumerNotesInputSection
        {...commonProps}
        setConsumerNotes={setConsumerNotesFn}
        agreement={createMockAgreement({ consumerNotes: 'foo' })}
      />
    )

    screen.rerender(
      <ConsumerNotesInputSection
        {...commonProps}
        setConsumerNotes={setConsumerNotesFn}
        agreement={createMockAgreement({ consumerNotes: 'bar' })}
      />
    )

    expect(setConsumerNotesFn).toHaveBeenCalledWith('bar')
  })

  // it('should correctly validate the consumer notes field user input', async () => {
  //   const screen = render(
  //     <ConsumerNotesInputSection
  //       {...commonProps}
  //       agreement={createMockAgreement({ consumerNotes: '' })}
  //     />
  //   )

  //   const user = userEvent.setup()
  //   const consumerNotesInput = screen.getByLabelText('Consumer notes')
  //   user.type(consumerNotesInput, 'a'.repeat(1001))
  //   expect(consumerNotesInput).toHaveValue('a'.repeat(1000))
  // })
})

describe('ConsumerNotestInputSectionSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<ConsumerNotesInputSectionSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})

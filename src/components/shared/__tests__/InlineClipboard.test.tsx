import React from 'react'
import { render } from '@testing-library/react'
import { InlineClipboard } from '@/components/shared/InlineClipboard'
import { vi } from 'vitest'

// use spyon

const mockInlineClipboardProps = {
  textToCopy: 'textToCopy',
  label: 'label',
}

describe("Checks that InlineClipboard snapshots don't change", () => {
  it('renders correctly on clipboard write permission given', () => {
    const inlineClipboard = render(<InlineClipboard {...mockInlineClipboardProps} />)

    expect(inlineClipboard).toMatchSnapshot()
  })

  it('renders correctly on clipboard write permission not given', () => {
    const inlineClipboard = render(<InlineClipboard {...mockInlineClipboardProps} />)

    expect(inlineClipboard).toMatchSnapshot()
  })
})

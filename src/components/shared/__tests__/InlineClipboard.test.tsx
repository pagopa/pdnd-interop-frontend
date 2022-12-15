import React from 'react'
import { render } from '@testing-library/react'
import { InlineClipboard } from '@/components/shared/InlineClipboard'
import { SpyInstance, vi } from 'vitest'

const mockInlineClipboardProps = {
  textToCopy: 'textToCopy',
  label: 'label',
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

Object.assign(window.navigator, {
  ...window.navigator,
  permissions: {
    query: vi.fn().mockImplementationOnce(() => Promise.resolve({ state: 'granted' })),
  },
})

describe("Checks that InlineClipboard snapshots don't change", () => {
  let permissionsQuery: SpyInstance
  beforeEach(() => {
    permissionsQuery = vi.spyOn(window.navigator.permissions, 'query')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders correctly on clipboard write permission given', () => {
    permissionsQuery.mockReturnValue(true)
    const inlineClipboard = render(<InlineClipboard {...mockInlineClipboardProps} />)

    expect(inlineClipboard).toMatchSnapshot()
  })

  it('renders correctly on clipboard write permission not given', () => {
    permissionsQuery.mockReturnValue(false)
    const inlineClipboard = render(<InlineClipboard {...mockInlineClipboardProps} />)

    expect(inlineClipboard).toMatchSnapshot()
  })
})

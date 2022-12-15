import React from 'react'
import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { ActionMenu } from '@/components/shared/ActionMenu'
import { ActionItem } from '@/types/common.types'

const mockActions: Array<ActionItem> = [
  {
    action: vi.fn,
    label: 'label1',
  },
]

describe("Checks that InfoTooltip snapshots don't change", () => {
  it('renders correctly', () => {
    const inlineClipboard = render(<ActionMenu actions={mockActions} />)

    expect(inlineClipboard).toMatchSnapshot()
  })
})

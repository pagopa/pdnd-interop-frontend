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

describe("Checks that ActionMenu snapshots don't change", () => {
  it('renders correctly', () => {
    const actionMenu = render(<ActionMenu actions={mockActions} />)

    expect(actionMenu).toMatchSnapshot()
  })
})

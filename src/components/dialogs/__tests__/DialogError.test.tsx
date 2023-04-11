import React from 'react'
import { DialogError } from '../DialogError'
import { vi } from 'vitest'
import { render } from '@testing-library/react'

describe('DialogError testing', () => {
  it('should match the snapshot', () => {
    const screen = render(<DialogError error={new Error('test')} resetErrorBoundary={vi.fn()} />)
    expect(screen.baseElement).toMatchSnapshot()
  })
})

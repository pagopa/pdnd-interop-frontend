import React from 'react'
import { render } from '@testing-library/react'
import { MaintenanceBanner } from '../MaintenanceBanner'
import { vi } from 'vitest'
import * as hooks from '@/hooks/useMaintenanceBanner'

vi.spyOn(hooks, 'useMaintenanceBanner').mockReturnValue({
  text: 'test banner maintenance',
  isOpen: true,
  closeBanner: vi.fn(),
})

describe("Checks that Maintenance banner snapshot don't change", () => {
  it('should renders correctly', () => {
    const { baseElement } = render(<MaintenanceBanner />)

    expect(baseElement).toMatchSnapshot()
  })
})

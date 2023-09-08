import React from 'react'
import { AppLayout } from '../AppLayout'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { vi } from 'vitest'

mockUseJwt()

vi.mock('../Breadcrumbs', () => {
  return { Breadcrumbs: () => <></> }
})

describe('AppLayout', () => {
  it('should match snapshot', () => {
    const screen = renderWithApplicationContext(<AppLayout>{}</AppLayout>, {
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot (hideSideNav)', () => {
    const screen = renderWithApplicationContext(<AppLayout hideSideNav>{}</AppLayout>, {
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })
})

import React from 'react'
import {
  mockUseClientKind,
  mockUseJwt,
  mockUseRouteParams,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import ConsumerClientManagePage from '../ConsumerClientManage.page'
import { vi } from 'vitest'

mockUseJwt({ isAdmin: true })
mockUseRouteParams({ clientId: 'clientId' })

const mathRandom = global.Math.random

beforeAll(() => {
  global.Math.random = vi.fn().mockImplementation(() => 1)
})

afterAll(() => {
  global.Math.random = mathRandom
})

describe('ConsumerClientManagePage (API)', () => {
  it('should match snapshot', () => {
    mockUseClientKind('API')
    const { baseElement } = renderWithApplicationContext(<ConsumerClientManagePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})

describe('ConsumerClientManagePage (CONSUMER)', () => {
  // global.Math.random = vi.fn().mockImplementation(() => 1)
  it('should match snapshot', () => {
    mockUseClientKind('CONSUMER')
    const { baseElement } = renderWithApplicationContext(<ConsumerClientManagePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})

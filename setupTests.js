import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import matchers from '@testing-library/jest-dom/matchers'

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})

vi.spyOn(global.console, 'log').mockImplementation(() => vi.fn())
vi.spyOn(global.console, 'error').mockImplementation(() => vi.fn())
vi.spyOn(global.console, 'warn').mockImplementation(() => vi.fn())

vi.stubGlobal('scroll', vi.fn())
vi.mock('zustand')
vi.mock('react-i18next')

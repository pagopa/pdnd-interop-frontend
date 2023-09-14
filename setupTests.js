import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
// extends Vitest's expect method with methods from react-testing-library
import '@testing-library/jest-dom/vitest'

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})

// vi.spyOn(global.console, 'log').mockImplementation(() => vi.fn())
vi.spyOn(global.console, 'error').mockImplementation(() => vi.fn())
vi.spyOn(global.console, 'warn').mockImplementation(() => vi.fn())

global.crypto.randomUUID = () => Math.random().toString()

vi.stubGlobal('scroll', vi.fn())
vi.mock('zustand')
vi.mock('react-i18next')

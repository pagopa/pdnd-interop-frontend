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

global.crypto.randomUUID = () =>
  Math.random().toString() as `${string}-${string}-${string}-${string}-${string}`

vi.stubGlobal('scroll', vi.fn())
vi.mock('zustand')
vi.mock('react-i18next')

process.env = {
  ...process.env,
  // This is needed in order to make the tests work.
  // The chosen REACT_APP_API_HOST value is random and could be any string.
  REACT_APP_API_HOST: 'http://localhost:8080',
}

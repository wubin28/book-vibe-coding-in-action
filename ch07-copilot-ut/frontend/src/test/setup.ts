import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(await import('@testing-library/jest-dom/matchers').then(module => module.default || module))

// Clean up after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})
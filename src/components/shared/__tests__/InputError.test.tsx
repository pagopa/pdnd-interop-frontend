import React from 'react'
import { render } from '@testing-library/react'
import { InputError } from '@/components/shared/InputError'

const mockError = new Error('message')

describe("Checks that InputError snapshot don't change", () => {
  it('renders correctly', () => {
    const inputError = render(<InputError error={mockError} />)

    expect(inputError.baseElement).toMatchSnapshot()
  })
})

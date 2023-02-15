import React from 'react'
import { render } from '@testing-library/react'
import { InputWrapper } from '@/components/shared/InputWrapper'
import { TextField } from '@mui/material'

const inputWrapperValues = {
  name: 'name',
  children: <TextField />,
  error: 'error',
  infoLabel: 'infoLabel',
}

describe("Checks that InputWrapper snapshot don't change", () => {
  it('renders correctly', () => {
    const inputWrapper = render(
      <InputWrapper name={inputWrapperValues.name}>{inputWrapperValues.children}</InputWrapper>
    )

    expect(inputWrapper).toMatchSnapshot()
  })

  it('renders correctly with error', () => {
    const inputWrapper = render(
      <InputWrapper name={inputWrapperValues.name} error={inputWrapperValues.error}>
        {inputWrapperValues.children}
      </InputWrapper>
    )

    expect(inputWrapper).toMatchSnapshot()
  })

  it('renders correctly with info label', () => {
    const inputWrapper = render(
      <InputWrapper name={inputWrapperValues.name} infoLabel={inputWrapperValues.infoLabel}>
        {inputWrapperValues.children}
      </InputWrapper>
    )

    expect(inputWrapper).toMatchSnapshot()
  })

  it('renders correctly with info label and error', () => {
    const inputWrapper = render(
      <InputWrapper
        name={inputWrapperValues.name}
        infoLabel={inputWrapperValues.infoLabel}
        error={inputWrapperValues.error}
      >
        {inputWrapperValues.children}
      </InputWrapper>
    )

    expect(inputWrapper).toMatchSnapshot()
  })
})

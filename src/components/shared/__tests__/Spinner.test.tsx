import React from 'react'
import { render } from '@testing-library/react'
import { Spinner } from '@/components/shared/Spinner'

describe("Checks that Spinner snapshots don't change", () => {
  it('renders correctly without label', () => {
    const spinner = render(<Spinner />)

    expect(spinner.baseElement).toMatchSnapshot()
  })

  it('renders correctly with label, aligned vertically', () => {
    const spinner = render(<Spinner label="label" />)

    expect(spinner.baseElement).toMatchSnapshot()
  })

  it('renders correctly with label, aligned horizontally', () => {
    const spinner = render(<Spinner label="label" direction="row" />)

    expect(spinner.baseElement).toMatchSnapshot()
  })
})

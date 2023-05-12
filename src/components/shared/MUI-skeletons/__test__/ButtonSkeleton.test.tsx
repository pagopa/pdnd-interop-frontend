import React from 'react'
import { render } from '@testing-library/react'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'

describe("Checks that ButtonSkeleton snapshots don't change", () => {
  it('renders small variant correctly', () => {
    const buttonSkeleton = render(<ButtonSkeleton width={100} size="small" />)

    expect(buttonSkeleton.baseElement).toMatchSnapshot()
  })

  it('renders medium variant correctly', () => {
    const buttonSkeleton = render(<ButtonSkeleton width={120} size="medium" />)

    expect(buttonSkeleton.baseElement).toMatchSnapshot()
  })

  it('renders large variant correctly', () => {
    const buttonSkeleton = render(<ButtonSkeleton width={140} size="large" />)

    expect(buttonSkeleton.baseElement).toMatchSnapshot()
  })
})

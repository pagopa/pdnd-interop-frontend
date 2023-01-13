import React from 'react'
import { render } from '@testing-library/react'
import { ButtonSkeleton } from '@/components/shared/MUISkeletons'

describe("Checks that ButtonSkeleton snapshots don't change", () => {
  it('renders small variant correctly', () => {
    const buttonSkeleton = render(<ButtonSkeleton width={100} size="small" />)

    expect(buttonSkeleton).toMatchSnapshot()
  })

  it('renders medium variant correctly', () => {
    const buttonSkeleton = render(<ButtonSkeleton width={120} size="medium" />)

    expect(buttonSkeleton).toMatchSnapshot()
  })

  it('renders large variant correctly', () => {
    const buttonSkeleton = render(<ButtonSkeleton width={140} size="large" />)

    expect(buttonSkeleton).toMatchSnapshot()
  })
})

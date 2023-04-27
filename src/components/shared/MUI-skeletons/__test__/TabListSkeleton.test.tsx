import React from 'react'
import { render } from '@testing-library/react'
import { TabListSkeleton } from '@/components/shared/MUI-skeletons'

describe("Checks that TabListSkeleton snapshots don't change", () => {
  it('renders correctly', () => {
    const tabListSkeleton = render(<TabListSkeleton />)

    expect(tabListSkeleton.baseElement).toMatchSnapshot()
  })
})

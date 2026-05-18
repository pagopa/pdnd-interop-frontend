import { screen } from '@testing-library/react'
import { DialogBasic } from '../DialogBasic'
import { apiGuideLink } from '@/config/constants'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('DialogBasic', () => {
  it('should render a description link when provided', () => {
    renderWithApplicationContext(
      <DialogBasic
        type="basic"
        title="Dialog title"
        description="Dialog description with <1>guide</1>."
        descriptionLink={{ href: apiGuideLink }}
        onProceed={vi.fn()}
      />,
      {}
    )

    expect(screen.getByRole('link', { name: 'guide' })).toHaveAttribute('href', apiGuideLink)
  })
})

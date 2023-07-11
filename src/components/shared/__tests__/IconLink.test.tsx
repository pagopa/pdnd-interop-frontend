import React from 'react'
import { render } from '@testing-library/react'
import { IconLink } from '../IconLink'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'

describe('IconLink', () => {
  it('should match snapshot without icons', () => {
    const screen = render(<IconLink>Test</IconLink>)
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with start icon', () => {
    const screen = render(<IconLink startIcon={<QuestionMarkIcon />}>Test</IconLink>)
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with end icon', () => {
    const screen = render(<IconLink endIcon={<QuestionMarkIcon />}>Test</IconLink>)
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with start and end icon', () => {
    const screen = render(
      <IconLink endIcon={<QuestionMarkIcon />} startIcon={<QuestionMarkIcon />}>
        Test
      </IconLink>
    )
    expect(screen.baseElement).toMatchSnapshot()
  })
})

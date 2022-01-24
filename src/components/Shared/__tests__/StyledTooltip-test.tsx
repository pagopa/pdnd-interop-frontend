import React from 'react'
import renderer from 'react-test-renderer'
import { StyledTooltip } from '../StyledTooltip'
import { Typography } from '@mui/material'

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(
      <StyledTooltip title="Il testo della mia tooltip">
        <Typography>Il mio elemento cliccabile</Typography>
      </StyledTooltip>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

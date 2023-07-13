import React from 'react'
import RiskAnalysisInputWrapper from '../RiskAnalysisInputWrapper'
import { render } from '@testing-library/react'
import { Typography } from '@mui/material'
import { vi } from 'vitest'

describe('RiskAnalysisInputWrapper testing', () => {
  it('should be render correctly without description and error', () => {
    vi.mock('react-hook-form', async () => ({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      ...(await vi.importActual('react-hook-form')),
      useFormContext: () => ({
        formState: {
          errors: {},
        },
      }),
    }))

    const screen = render(
      <RiskAnalysisInputWrapper label={'Test title'}>
        <Typography>Test children for snapshot</Typography>
      </RiskAnalysisInputWrapper>
    )

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should be render correclty with infoLabel and without error', () => {
    vi.mock('react-hook-form', async () => ({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      ...(await vi.importActual('react-hook-form')),
      useFormContext: () => ({
        formState: {
          errors: {},
        },
      }),
    }))

    const screen = render(
      <RiskAnalysisInputWrapper label={'Test title'} infoLabel="Test description">
        <Typography>Test children for snapshot</Typography>
      </RiskAnalysisInputWrapper>
    )

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should be render correclty with error and without infoLabel', () => {
    const screen = render(
      <RiskAnalysisInputWrapper label="Test title" error="test">
        <Typography>Test children for snapshot</Typography>
      </RiskAnalysisInputWrapper>
    )

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should be render correctly with error and infoLabel', () => {
    const screen = render(
      <RiskAnalysisInputWrapper label={'Test title'} infoLabel={'test'} error="Test error">
        <Typography>Test children for snapshot</Typography>
      </RiskAnalysisInputWrapper>
    )

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should be render correctly with error, infoLabel and helperText', () => {
    const screen = render(
      <RiskAnalysisInputWrapper
        label="Test title"
        infoLabel="test"
        error="Test error"
        helperText="helperText"
      >
        <Typography>Test children for snapshot</Typography>
      </RiskAnalysisInputWrapper>
    )

    expect(screen.baseElement).toMatchSnapshot()
  })
})

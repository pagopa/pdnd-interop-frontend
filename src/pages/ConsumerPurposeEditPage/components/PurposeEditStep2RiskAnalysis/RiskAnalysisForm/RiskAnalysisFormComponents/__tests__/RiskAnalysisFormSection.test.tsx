import React from 'react'
import RiskAnalysisFormSection from '../RiskAnalysisInputWrapper'
import { render } from '@testing-library/react'
import { Typography } from '@mui/material'
import { vi } from 'vitest'

describe('RiskAnalysisFormSection testing', () => {
  it('should be render correclty without description and error', () => {
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
      <RiskAnalysisFormSection title={'Test title'} formFieldName={'test'}>
        <Typography>Test children for snapshot</Typography>
      </RiskAnalysisFormSection>
    )

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should be render correclty with description and without error', () => {
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
      <RiskAnalysisFormSection
        title={'Test title'}
        formFieldName={'test'}
        description="Test description"
      >
        <Typography>Test children for snapshot</Typography>
      </RiskAnalysisFormSection>
    )

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should be render correclty with error and without description', () => {
    vi.mock('react-hook-form', async () => ({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      ...(await vi.importActual('react-hook-form')),
      useFormContext: () => ({
        formState: {
          errors: {
            test: {
              message: 'test error',
              type: 'required',
            },
          },
        },
      }),
    }))

    const screen = render(
      <RiskAnalysisFormSection title={'Test title'} formFieldName={'test'}>
        <Typography>Test children for snapshot</Typography>
      </RiskAnalysisFormSection>
    )

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should be render correclty with description and error', () => {
    vi.mock('react-hook-form', async () => ({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      ...(await vi.importActual('react-hook-form')),
      useFormContext: () => ({
        formState: {
          errors: {
            test: {
              message: 'test error',
              type: 'required',
            },
          },
        },
      }),
    }))

    const screen = render(
      <RiskAnalysisFormSection
        title={'Test title'}
        formFieldName={'test'}
        description="Test description"
      >
        <Typography>Test children for snapshot</Typography>
      </RiskAnalysisFormSection>
    )

    expect(screen.baseElement).toMatchSnapshot()
  })
})

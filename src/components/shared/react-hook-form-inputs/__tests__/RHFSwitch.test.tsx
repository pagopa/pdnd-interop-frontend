import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TestInputWrapper } from '@/components/shared/react-hook-form-inputs/__tests__/test-utils'
import { RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { vi } from 'vitest'

const switchProps = {
  standard: {
    label: 'label',
    name: 'test',
  },
}

describe('determine whether the integration between react-hook-form and MUI’s Switch works', () => {
  it('gets the input from the user correctly', async () => {
    const user = userEvent.setup()
    const switchResult = render(
      <TestInputWrapper>
        <RHFSwitch {...switchProps.standard} />
      </TestInputWrapper>
    )

    const switchInput = switchResult.getByRole('checkbox')
    expect(switchInput).not.toBeChecked()

    await user.click(switchInput)
    expect(switchInput).toBeChecked()

    await user.click(switchInput)
    expect(switchInput).not.toBeChecked()
  })

  it('should call the onValueChange callback when the value changes', async () => {
    const onValueChange = vi.fn()
    const switchResult = render(
      <TestInputWrapper>
        <RHFSwitch {...switchProps.standard} onValueChange={onValueChange} />
      </TestInputWrapper>
    )

    const switchInput = switchResult.getByRole('checkbox')
    expect(switchInput).not.toBeChecked()

    await userEvent.click(switchInput)
    expect(switchInput).toBeChecked()
    expect(onValueChange).toHaveBeenCalledWith(true)
  })

  it('should match the snapshot', async () => {
    const { baseElement } = render(
      <TestInputWrapper>
        <RHFSwitch {...switchProps.standard} />
      </TestInputWrapper>
    )

    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot in vertical layout', async () => {
    const { baseElement } = render(
      <TestInputWrapper>
        <RHFSwitch {...switchProps.standard} vertical />
      </TestInputWrapper>
    )

    expect(baseElement).toMatchSnapshot()
  })
})

import React from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { TestInputWrapper } from '@/components/shared/ReactHookFormInputs/__tests__/test-utils'
import { SingleFileInput } from '@/components/shared/ReactHookFormInputs'

const mockFn = vi.fn()
const singleFileInputProps = {
  standard: {
    name: 'testFile',
    onFileSelected: mockFn,
  },
}

describe('determine whether the integration between react-hook-form and MUI’s Switch works', () => {
  let file: File

  beforeEach(() => {
    file = new File(['testFile'], 'testFile.pdf', { type: 'document/pdf' })
  })

  it('gets the input from the user correctly', async () => {
    const user = userEvent.setup()
    const singleFileInput = render(
      <TestInputWrapper>
        <SingleFileInput {...singleFileInputProps.standard} />
      </TestInputWrapper>
    )

    const input = singleFileInput.container.querySelector('input[type="file"]')
    await act(() => {
      fireEvent.change(input!, { target: { files: file } })
    })

    expect(mockFn).toBeCalled()
  })
})

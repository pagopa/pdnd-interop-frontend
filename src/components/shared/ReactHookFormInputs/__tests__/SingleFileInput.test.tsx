import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'

import { TestInputWrapper } from '@/__mocks__/mock.utils'
import { SingleFileInput } from '@/components/shared/ReactHookFormInputs'

const singleFileInputProps = {
  name: 'testFile',
}

describe('determine whether the integration between react-hook-form and MUI’s Switch works', () => {
  let file: File

  beforeEach(() => {
    file = new File(['testFile'], 'testFile.pdf', { type: 'document/pdf' })
  })

  it('gets the input from the user correctly', async () => {
    const singleFileInput = render(
      <TestInputWrapper>
        <SingleFileInput {...singleFileInputProps} />
      </TestInputWrapper>
    )

    const fileInput = singleFileInput.getByRole('button') as HTMLInputElement
    expect(fileInput).toBeInTheDocument()
    await waitFor(() => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    expect(fileInput.files![0].name).toEqual('testFile.pdf')
  })

  it('removes the file from the input correctly', async () => {
    const singleFileInput = render(
      <TestInputWrapper>
        <SingleFileInput {...singleFileInputProps} />
      </TestInputWrapper>
    )

    const fileInput = singleFileInput.getByRole('button') as HTMLInputElement
    expect(fileInput).toBeInTheDocument()

    await waitFor(() => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })
    expect(fileInput.files![0]).not.toEqual(null)
    expect(fileInput.files![0].name).toEqual('testFile.pdf')

    await waitFor(() => {
      fireEvent.change(fileInput, { target: { files: [null] } })
    })
    expect(fileInput.files![0]).toEqual(null)
  })
})

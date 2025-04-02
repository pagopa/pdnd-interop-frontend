import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'

import { TestInputWrapper } from '@/components/shared/react-hook-form-inputs/__tests__/test-utils'
import { RHFSingleFileInput } from '@/components/shared/react-hook-form-inputs'

const singleFileInputProps = {
  name: 'testFile',
  dropzoneButton: 'TBD',
}

describe('determine whether the integration between react-hook-form and MUI’s Switch works', () => {
  let file: File

  beforeEach(() => {
    file = new File(['testFile'], 'testFile.pdf', { type: 'document/pdf' })
  })

  it('gets the input from the user correctly', async () => {
    const singleFileInput = render(
      <TestInputWrapper>
        <RHFSingleFileInput {...singleFileInputProps} />
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
        <RHFSingleFileInput {...singleFileInputProps} />
      </TestInputWrapper>
    )

    const fileInput = singleFileInput.getByRole('button') as HTMLInputElement

    expect(fileInput).not.toBeInTheDocument()

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

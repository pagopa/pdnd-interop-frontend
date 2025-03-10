import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'

import { TestInputWrapper } from '@/components/shared/react-hook-form-inputs/__tests__/test-utils'
import { RHFSingleFileInput } from '@/components/shared/react-hook-form-inputs'

const singleFileInputProps = {
  name: 'testFile',
}

describe('determine whether the integration between react-hook-form and MUI’s Switch works', () => {
  let file: File

  beforeEach(() => {
    file = new File(['testFile'], 'testFile.pdf', { type: 'document/pdf' })
  })

  it('gets the input from the user correctly via drag and drop', async () => {
    const singleFileInput = render(
      <TestInputWrapper>
        <RHFSingleFileInput {...singleFileInputProps} />
      </TestInputWrapper>
    )

    const dragAndDropButton = singleFileInput.getByTestId('loadFromPc') as HTMLInputElement
    expect(dragAndDropButton).toBeInTheDocument()
    await waitFor(() => {
      fireEvent.change(dragAndDropButton, { target: { files: [file] } })
    })

    expect(dragAndDropButton.files![0].name).toEqual('testFile.pdf')
  })

  it('gets the input from the user correctly upload button', async () => {
    const singleFileInput = render(
      <TestInputWrapper>
        <RHFSingleFileInput {...singleFileInputProps} />
      </TestInputWrapper>
    )

    const buttons = singleFileInput.getAllByRole('button') as HTMLInputElement[]
    const inputButton = buttons[0] as HTMLInputElement

    expect(inputButton).toBeInTheDocument()
    await waitFor(() => {
      fireEvent.change(inputButton, { target: { files: [file] } })
    })

    expect(inputButton.files![0].name).toEqual('testFile.pdf')
  })

  it('removes the file from the input correctly', async () => {
    const singleFileInput = render(
      <TestInputWrapper>
        <RHFSingleFileInput {...singleFileInputProps} />
      </TestInputWrapper>
    )

    const fileInput = singleFileInput.getByTestId('loadFromPc') as HTMLInputElement

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

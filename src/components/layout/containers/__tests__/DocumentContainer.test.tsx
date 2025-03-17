import React from 'react'
import { render } from '@testing-library/react'
import { DocumentContainer } from '../DocumentContainer'
import type { Document } from '@/api/api.generatedTypes'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'

const docMock: Document = {
  id: '1',
  name: 'name',
  contentType: 'pdf',
  prettyName: 'document',
  createdAt: '2023-02-15T09:32:57.053Z',
}

describe('DocumentContainer', () => {
  it('should correctly edit document name', async () => {
    const onUpdateDescription = vi.fn()
    const screen = render(
      <DocumentContainer doc={docMock} onUpdateDescription={onUpdateDescription} />
    )
    const user = userEvent.setup()

    const editButton = screen.getByRole('button', { name: 'editDocumentName' })
    await user.click(editButton)
    const input = screen.getByRole('textbox', { name: 'prettyName.label' })
    await user.type(input, ' new name')
    await user.tab()
    expect(onUpdateDescription).toBeCalledWith('document new name')
  })
})

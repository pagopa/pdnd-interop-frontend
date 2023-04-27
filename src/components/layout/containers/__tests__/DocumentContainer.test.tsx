import React from 'react'
import { render } from '@testing-library/react'
import { DocumentContainer } from '../DocumentContainer'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'

const docMock: EServiceDoc = {
  id: '1',
  name: 'name',
  contentType: 'pdf',
  prettyName: 'document',
}

describe('DocumentContainer', () => {
  it('should match snapshot', () => {
    const screen = render(<DocumentContainer doc={docMock} />)
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with onUpdateDescription callback passed', () => {
    const screen = render(<DocumentContainer doc={docMock} onUpdateDescription={vi.fn()} />)
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with onDelete callback passed', () => {
    const screen = render(<DocumentContainer doc={docMock} onDelete={vi.fn()} />)
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with onDownload callback passed', () => {
    const screen = render(<DocumentContainer doc={docMock} onDownload={vi.fn()} />)
    expect(screen.baseElement).toMatchSnapshot()
  })

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

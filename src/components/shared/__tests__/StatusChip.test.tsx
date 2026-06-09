import React from 'react'
import { render } from '@testing-library/react'
import { StatusChip } from '@/components/shared/StatusChip'

describe('StatusChip for="eservice" archiving masking', () => {
  it('masks ARCHIVING as the active (PUBLISHED) status', () => {
    const { baseElement } = render(<StatusChip for="eservice" state="ARCHIVING" />)
    expect(baseElement).toHaveTextContent('status.eservice.PUBLISHED')
  })

  it('masks ARCHIVING_SUSPENDED as the suspended status', () => {
    const { baseElement } = render(<StatusChip for="eservice" state="ARCHIVING_SUSPENDED" />)
    expect(baseElement).toHaveTextContent('status.eservice.SUSPENDED')
  })

  it('leaves non-archiving states unchanged', () => {
    const { baseElement } = render(<StatusChip for="eservice" state="DEPRECATED" />)
    expect(baseElement).toHaveTextContent('status.eservice.DEPRECATED')
  })
})

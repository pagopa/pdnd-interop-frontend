import React from 'react'
import { render } from '@testing-library/react'
import ConsumerPurposeTemplateListPage from '../ConsumerPurposeTemplateList.page'

describe('ConsumerPurposeTemplateListPage', () => {
  it('should render correctly', () => {
    const screen = render(<ConsumerPurposeTemplateListPage />)

    expect(screen.getByText('LISTA TEMPLATE')).toBeInTheDocument()
  })

  it('should be a React functional component', () => {
    expect(ConsumerPurposeTemplateListPage).toBeInstanceOf(Function)
  })
})

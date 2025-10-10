import React from 'react'
import { render } from '@testing-library/react'
import ConsumerPurposeTemplateCatalogPage from '../ConsumerPurposeTemplateCatalog.page'

describe('ConsumerPurposeTemplateCatalogPage', () => {
  it('should render correctly', () => {
    const screen = render(<ConsumerPurposeTemplateCatalogPage />)

    expect(screen.getByText('CATALOGO TEMPLATE')).toBeInTheDocument()
  })

  it('should be a React functional component', () => {
    expect(ConsumerPurposeTemplateCatalogPage).toBeInstanceOf(Function)
  })
})

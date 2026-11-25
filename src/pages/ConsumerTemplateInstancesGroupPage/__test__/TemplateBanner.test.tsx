import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import TemplateBanner from '../components/TemplateBanner'

const template = {
  producerName: 'Template producer',
  name: 'Template name',
  id: 'template-id',
  versionId: 'template-version-id',
}

const renderBanner = () =>
  renderWithApplicationContext(
    <TemplateBanner
      templateProducerName={template.producerName}
      templateName={template.name}
      templateId={template.id}
      templateVersionId={template.versionId}
    />,
    { withRouterContext: true }
  )

describe('TemplateBanner', () => {
  it('renders the title, description and details link', () => {
    renderBanner()

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'buttonLabel' })).toBeInTheDocument()
  })

  it('navigates to the template details using the template and version IDs', async () => {
    const user = userEvent.setup()
    const { history } = renderBanner()

    await user.click(screen.getByRole('link', { name: 'buttonLabel' }))

    expect(history.location.pathname).toBe(
      `/it/erogazione/catalogo-template/${template.id}/${template.versionId}`
    )
  })
})

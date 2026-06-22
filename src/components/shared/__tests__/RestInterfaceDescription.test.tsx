import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RestInterfaceDescription } from '../RestInterfaceDescription'

const restInterfaceDescriptionProps = {
  description: 'Upload the OpenAPI file.',
  beforePublishing: 'Before publishing, check:',
  technicalCompliance: 'technical compliance',
  technicalComplianceDescription: 'with ModI guidelines through',
  semanticCompliance: 'semantic compliance',
  semanticComplianceDescription: 'with National Data Catalog annotations through',
  openApiCheckerLabel: 'OpenAPI Checker',
  schemaEditorLabel: 'Schema Editor',
}

describe('RestInterfaceDescription', () => {
  it('renders the introductory copy and the compliance list', () => {
    render(<RestInterfaceDescription {...restInterfaceDescriptionProps} />)

    expect(screen.getByText(restInterfaceDescriptionProps.description)).toBeInTheDocument()
    expect(screen.getByText(restInterfaceDescriptionProps.beforePublishing)).toBeInTheDocument()

    const complianceItems = screen.getAllByRole('listitem')
    expect(complianceItems).toHaveLength(2)
    expect(complianceItems[0]).toHaveTextContent('technical compliance')
    expect(complianceItems[0]).toHaveTextContent('with ModI guidelines through')
    expect(complianceItems[1]).toHaveTextContent('semantic compliance')
    expect(complianceItems[1]).toHaveTextContent('with National Data Catalog annotations through')
  })

  it('renders the OpenAPI Checker and Schema Editor external links', () => {
    render(<RestInterfaceDescription {...restInterfaceDescriptionProps} />)

    expect(screen.getByRole('link', { name: /OpenAPI Checker/ })).toHaveAttribute(
      'href',
      'https://italia.github.io/api-oas-checker/'
    )
    expect(screen.getByRole('link', { name: /Schema Editor/ })).toHaveAttribute(
      'href',
      'https://schema.gov.it/schema-editor'
    )
  })

  it('calls the OpenAPI Checker tracking callback when the link is clicked', async () => {
    const user = userEvent.setup()
    const onOpenApiCheckerClick = vi.fn()

    render(
      <RestInterfaceDescription
        {...restInterfaceDescriptionProps}
        onOpenApiCheckerClick={onOpenApiCheckerClick}
      />
    )

    await user.click(screen.getByRole('link', { name: /OpenAPI Checker/ }))

    expect(onOpenApiCheckerClick).toHaveBeenCalledTimes(1)
  })
})

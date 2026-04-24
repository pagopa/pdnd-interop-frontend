import { ReactHookFormWrapper, renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceVoucherSection } from '../EServiceVoucherSection'
import { screen } from '@testing-library/react'

vi.mock('@pagopa/interop-fe-commons', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await vi.importActual<typeof import('@pagopa/interop-fe-commons')>(
    '@pagopa/interop-fe-commons'
  )

  return {
    ...actual,
    InformationContainer: ({ label, content }: { label: string; content: string }) => (
      <div data-testid="information-container">
        <span data-testid="label">{label}</span>
        <span data-testid="content">{content}</span>
      </div>
    ),
  }
})

const renderComponent = (isEServiceCreatedFromTemplate: boolean) => {
  return renderWithApplicationContext(
    <ReactHookFormWrapper>
      <EServiceVoucherSection isEServiceCreatedFromTemplate={isEServiceCreatedFromTemplate} />
    </ReactHookFormWrapper>,
    {
      withReactQueryContext: false,
      withRouterContext: false,
    }
  )
}

describe('EServiceVoucherSection', () => {
  it('should render title', () => {
    renderComponent(false)
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should render 2 input field (voucherLifespan, audience)', () => {
    renderComponent(false)
    expect(screen.getAllByText('voucherLifespanField.label').length).toBeGreaterThan(0)
    expect(screen.getAllByText('audienceField.label').length).toBeGreaterThan(0)
  })

  it('should render voucherLifespan information container and audience input', () => {
    renderComponent(true)
    expect(screen.getByTestId('information-container')).toBeInTheDocument()
    expect(screen.getAllByText('audienceField.label').length).toBeGreaterThan(0)
  })
})

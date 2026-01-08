import { renderWithApplicationContext } from '@/utils/testing.utils'
import { ConsumerPurposeTemplateCatalogDetailsTab } from '../components/ConsumerPurposeTemplateCatalogDetailsTab'
import { createMockPurposeTemplate } from '../../../../__mocks__/data/purposeTemplate.mocks'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'

const mockPurposeTemplate = createMockPurposeTemplate()

const mockUpdateActiveTab = vi.fn()

vi.mock('@/hooks/useActiveTab', () => ({
  useActiveTab: () => ({
    updateActiveTab: mockUpdateActiveTab,
  }),
}))

describe('ConsumerPurposeTemplateCatalogDetailsTab', () => {
  it('should render correctly', async () => {
    const screen = renderWithApplicationContext(
      <ConsumerPurposeTemplateCatalogDetailsTab purposeTemplate={mockPurposeTemplate} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen).toBeDefined()
  })

  it('should render createdBy, destination, handlePersonalData, purposeDescription fields', () => {
    const screen = renderWithApplicationContext(
      <ConsumerPurposeTemplateCatalogDetailsTab purposeTemplate={mockPurposeTemplate} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByText(mockPurposeTemplate.creator.name)).toBeInTheDocument()
    expect(screen.getByText(mockPurposeTemplate.targetDescription)).toBeInTheDocument()
    expect(
      screen.getByText(mockPurposeTemplate.handlesPersonalData ? 'yes' : 'no')
    ).toBeInTheDocument()
    expect(screen.getByText(mockPurposeTemplate.purposeDescription)).toBeInTheDocument()
  })

  it('should render button Download Risk Analysis', () => {
    const screen = renderWithApplicationContext(
      <ConsumerPurposeTemplateCatalogDetailsTab purposeTemplate={mockPurposeTemplate} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(screen.queryByText('riskAnalysisDownloadLink')).toBeInTheDocument()
  })

  it('should render "linked e-services" and call useActiveTab when clicked', async () => {
    const user = userEvent.setup()

    const screen = renderWithApplicationContext(
      <ConsumerPurposeTemplateCatalogDetailsTab purposeTemplate={mockPurposeTemplate} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const linkedEservicesButton = screen.getByText('linkedEservicesLink')

    expect(linkedEservicesButton).toBeInTheDocument()
    await user.click(linkedEservicesButton)

    await waitFor(() => {
      expect(mockUpdateActiveTab).toHaveBeenCalledTimes(1)
      expect(mockUpdateActiveTab).toHaveBeenCalledWith('', 'linkedEservices')
    })
  })
})
